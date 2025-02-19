import { LineRange } from "./common/lineRange";
import { Range } from "./common/range";
import { splitLines } from "./common/strings";
import {
  IDocumentDiff,
  IDocumentDiffProviderOptions,
} from "./diff/documentDiffProvider";
import { linesDiffComputers } from "./diff/linesDiffComputers";
import { DetailedLineRangeMapping, RangeMapping } from "./diff/rangeMapping";

export type DiffAlgorithmName = "legacy" | "advanced";

export interface IDiffOptions extends IDocumentDiffProviderOptions {
  diffAlgorithm: DiffAlgorithmName;
}

export const defaultDiffOption: IDiffOptions = {
  ignoreTrimWhitespace: true,
  maxComputationTimeMs: 1000,
  computeMoves: false,
  extendToSubwords: false,
  diffAlgorithm: "advanced",
};

export class Codiff {
  static maxCacheSize = 100;
  private static readonly diffCache = new Map<string, IDocumentDiff>();

  protected getDiffAlgorithm(name?: DiffAlgorithmName) {
    if (name === "legacy") {
      return linesDiffComputers.getLegacy();
    }
    return linesDiffComputers.getDefault();
  }

  protected getFullRange(lines: string[]): Range {
    return new Range(
      1,
      1,
      lines.length + 1,
      lines[lines.length - 1].length + 1
    );
  }

  protected getDiffCacheKey(original: string, modified: string) {
    return `${original}-codiff-cache-key-${modified}`;
  }

  computeDiff(
    original: string,
    modified: string,
    options: IDiffOptions = defaultDiffOption
  ): IDocumentDiff {
    const originalLines = splitLines(original);
    const modifiedLines = splitLines(modified);

    // This significantly speeds up the case when the original file is empty
    if (originalLines.length === 1 && originalLines[0].length === 0) {
      if (modifiedLines.length === 1 && modifiedLines[0].length === 0) {
        return {
          changes: [],
          identical: true,
          quitEarly: false,
          moves: [],
        };
      }

      return {
        changes: [
          new DetailedLineRangeMapping(
            new LineRange(1, 2),
            new LineRange(1, modifiedLines.length + 1),
            [
              new RangeMapping(
                this.getFullRange(originalLines),
                this.getFullRange(modifiedLines)
              ),
            ]
          ),
        ],
        identical: false,
        quitEarly: false,
        moves: [],
      };
    }

    const diffAlgorithm = this.getDiffAlgorithm(options.diffAlgorithm);
    const result = diffAlgorithm.computeDiff(
      originalLines,
      modifiedLines,
      options
    );
    const diffResult: IDocumentDiff = {
      changes: result.changes,
      quitEarly: result.hitTimeout,
      identical: original === modified,
      moves: result.moves,
    };
    if (Codiff.diffCache.size > Codiff.maxCacheSize) {
      Codiff.diffCache.delete(Codiff.diffCache.keys().next().value!);
    }
    Codiff.diffCache.set(this.getDiffCacheKey(original, modified), diffResult);
    return diffResult;
  }
}
