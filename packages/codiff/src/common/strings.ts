import { CharCode } from "./charCode";

/**
 * @returns the length of the common prefix of the two strings.
 */
export function commonPrefixLength(a: string, b: string): number {
  const len = Math.min(a.length, b.length);
  let i: number;

  for (i = 0; i < len; i++) {
    if (a.charCodeAt(i) !== b.charCodeAt(i)) {
      return i;
    }
  }

  return len;
}

/**
 * @returns the length of the common suffix of the two strings.
 */
export function commonSuffixLength(a: string, b: string): number {
  const len = Math.min(a.length, b.length);
  let i: number;

  const aLastIndex = a.length - 1;
  const bLastIndex = b.length - 1;

  for (i = 0; i < len; i++) {
    if (a.charCodeAt(aLastIndex - i) !== b.charCodeAt(bLastIndex - i)) {
      return i;
    }
  }

  return len;
}

export function splitLines(str: string): string[] {
  return str.split(/\r\n|\r|\n/);
}

/**
 * Returns first index of the string that is not whitespace.
 * If string is empty or contains only whitespaces, returns -1
 */
export function firstNonWhitespaceIndex(str: string): number {
  for (let i = 0, len = str.length; i < len; i++) {
    const chCode = str.charCodeAt(i);
    if (chCode !== CharCode.Space && chCode !== CharCode.Tab) {
      return i;
    }
  }
  return -1;
}

/**
 * Returns last index of the string that is not whitespace.
 * If string is empty or contains only whitespaces, returns -1
 */
export function lastNonWhitespaceIndex(
  str: string,
  startIndex: number = str.length - 1,
): number {
  for (let i = startIndex; i >= 0; i--) {
    const chCode = str.charCodeAt(i);
    if (chCode !== CharCode.Space && chCode !== CharCode.Tab) {
      return i;
    }
  }
  return -1;
}
