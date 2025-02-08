import { LineRange } from "../common/lineRange";
import {
  IDocumentDiff,
  IDocumentDiffProvider,
  IDocumentDiffProviderOptions,
} from "./documentDiffProvider";
import { linesDiffComputers } from "./linesDiffComputers";
import { ITextModel } from "./model";
import { DetailedLineRangeMapping, RangeMapping } from "./rangeMapping";

export type DiffAlgorithmName = "legacy" | "advanced";

export interface IDefaultDocumentDiffProviderOptions {
  readonly diffAlgorithm?: DiffAlgorithmName | IDocumentDiffProvider;
}

export class DefaultDocumentDiffProvider implements IDocumentDiffProvider {
  private diffAlgorithm: DiffAlgorithmName | IDocumentDiffProvider = "advanced";

  private static readonly diffCache = new Map<
    string,
    { result: IDocumentDiff; context: string }
  >();

  constructor(options: IDefaultDocumentDiffProviderOptions) {
    if (options.diffAlgorithm) {
      this.diffAlgorithm = options.diffAlgorithm;
    }
  }

  protected getDiffAlgorithm(name?: DiffAlgorithmName) {
    if (name === "legacy") {
      return linesDiffComputers.getLegacy();
    }
    return linesDiffComputers.getDefault();
  }

  async computeDiff(
    original: ITextModel,
    modified: ITextModel,
    options: IDocumentDiffProviderOptions,
  ): Promise<IDocumentDiff> {
    if (typeof this.diffAlgorithm !== "string") {
      return this.diffAlgorithm.computeDiff(original, modified, options);
    }

    // This significantly speeds up the case when the original file is empty
    if (original.getLineCount() === 1 && original.getLineMaxColumn(1) === 1) {
      if (modified.getLineCount() === 1 && modified.getLineMaxColumn(1) === 1) {
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
            new LineRange(1, modified.getLineCount() + 1),
            [
              new RangeMapping(
                original.getFullModelRange(),
                modified.getFullModelRange(),
              ),
            ],
          ),
        ],
        identical: false,
        quitEarly: false,
        moves: [],
      };
    }

    const uriKey = JSON.stringify([
      original.uri.toString(),
      modified.uri.toString(),
    ]);
    const context = JSON.stringify([
      original.id,
      modified.id,
      JSON.stringify(options),
    ]);
    const c = DefaultDocumentDiffProvider.diffCache.get(uriKey);
    if (c && c.context === context) {
      return c.result;
    }

    const result = this.getDiffAlgorithm().computeDiff(
      original.getLinesContent(),
      modified.getLinesContent(),
      options,
    );

    if (!result) {
      throw new Error("no diff result available");
    }

    // max 10 items in cache
    if (DefaultDocumentDiffProvider.diffCache.size > 10) {
      DefaultDocumentDiffProvider.diffCache.delete(
        DefaultDocumentDiffProvider.diffCache.keys().next().value!,
      );
    }

    const diffResult: IDocumentDiff = {
      changes: result.changes,
      quitEarly: result.hitTimeout,
      identical: original.getValue() === modified.getValue(),
      moves: result.moves,
    };

    DefaultDocumentDiffProvider.diffCache.set(uriKey, {
      result: diffResult,
      context,
    });
    return diffResult;
  }
}
