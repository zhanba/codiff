export interface ITextModel {
  /**
   * Get the text for all lines.
   */
  getLinesContent(): string[];
  /**
   * Get value of the current model attached to this editor.
   * @see {@link ITextModel.getValue}
   */
  getValue(options?: { preserveBOM: boolean; lineEnding: string }): string;
}
