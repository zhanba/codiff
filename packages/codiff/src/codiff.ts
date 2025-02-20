import { LRUCache } from "./common/cache";
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

export interface ICodiffOptions {
  diffOptions: IDiffOptions;
  cacheSize: number;
}

export class Codiff {
  protected readonly defaultCacheSize = 100;
  protected readonly defaultDiffOption: IDiffOptions = {
    ignoreTrimWhitespace: true,
    maxComputationTimeMs: 1000,
    computeMoves: false,
    extendToSubwords: false,
    diffAlgorithm: "advanced",
  };
  private readonly diffCache: LRUCache<string, IDocumentDiff>;
  private readonly options: ICodiffOptions;

  constructor(options?: Partial<ICodiffOptions>) {
    this.options = {
      diffOptions: this.defaultDiffOption,
      cacheSize: this.defaultCacheSize,
      ...options,
    };

    this.diffCache = new LRUCache<string, IDocumentDiff>(
      this.options.cacheSize
    );
  }

  private getDiffAlgorithm(name?: DiffAlgorithmName) {
    if (name === "legacy") {
      return linesDiffComputers.getLegacy();
    }
    return linesDiffComputers.getDefault();
  }

  private getFullRange(lines: string[]): Range {
    return new Range(
      1,
      1,
      lines.length + 1,
      lines[lines.length - 1].length + 1
    );
  }

  protected getContentKey(content: string) {
    return content;
  }

  private getDiffCacheKey(original: string, modified: string) {
    return `${this.getContentKey(original)}-codiff-cache-key-${this.getContentKey(modified)}`;
  }

  computeDiff(
    original: string,
    modified: string,
    options?: Partial<IDiffOptions>
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

    const cacheKey = this.getDiffCacheKey(original, modified);
    const cachedResult = this.diffCache.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }
    const diffOptions = { ...this.options.diffOptions, ...options };
    const diffAlgorithm = this.getDiffAlgorithm(diffOptions.diffAlgorithm);
    const result = diffAlgorithm.computeDiff(
      originalLines,
      modifiedLines,
      diffOptions
    );
    const diffResult: IDocumentDiff = {
      changes: result.changes,
      quitEarly: result.hitTimeout,
      identical: original === modified,
      moves: result.moves,
    };
    this.diffCache.put(cacheKey, diffResult);
    return diffResult;
  }
}
