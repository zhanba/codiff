import {
  IDocumentDiff,
  IDocumentDiffProvider,
  IDocumentDiffProviderOptions,
} from "./diff/documentDiffProvider";
import { linesDiffComputers } from "./diff/linesDiffComputers";
import { ITextModel } from "./diff/model";

export class SyncDocumentDiffProvider implements IDocumentDiffProvider {
  computeDiff(
    original: ITextModel,
    modified: ITextModel,
    options: IDocumentDiffProviderOptions,
  ): Promise<IDocumentDiff> {
    const result = linesDiffComputers
      .getDefault()
      .computeDiff(
        original.getLinesContent(),
        modified.getLinesContent(),
        options,
      );
    return Promise.resolve({
      changes: result.changes,
      quitEarly: result.hitTimeout,
      identical: original.getValue() === modified.getValue(),
      moves: result.moves,
    });
  }
}
