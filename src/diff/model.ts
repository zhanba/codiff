import { Range } from "../common/range.js";

export interface ITextModel {
  /**
   * Gets the resource associated with this editor model.
   */
  readonly uri: string;

  /**
   * A unique identifier associated with this model.
   */
  readonly id: string;

  /**
   * Get the text for all lines.
   */
  getLinesContent(): string[];
  /**
   * Get value of the current model attached to this editor.
   * @see {@link ITextModel.getValue}
   */
  getValue(options?: { preserveBOM: boolean; lineEnding: string }): string;

  /**
   * Get the number of lines in the model.
   */
  getLineCount(): number;

  /**
   * Get the maximum legal column for line at `lineNumber`
   */
  getLineMaxColumn(lineNumber: number): number;

  /**
   * Get a range covering the entire model.
   */
  getFullModelRange(): Range;
}
