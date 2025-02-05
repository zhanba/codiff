// Helper: generate a random integer between min and max inclusive
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper: list of sample words for generating code lines
const sampleWords = [
  "function",
  "const",
  "let",
  "var",
  "if",
  "else",
  "for",
  "while",
  "return",
  "new",
  "import",
  "from",
  "class",
  "this",
  "=>",
  "break",
  "continue",
  "true",
  "false",
  "null",
  "undefined",
];

// Helper: generate a random word from sampleWords
function randomWord(): string {
  return sampleWords[randomInt(0, sampleWords.length - 1)];
}

// Helper: generate a random code-like line
function generateRandomLine(): string {
  // Create a line with a random number of words (between 5 and 10)
  const wordCount = randomInt(5, 10);
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(randomWord());
  }
  // Optionally, add a semicolon at the end to mimic a statement
  return words.join(" ") + ";";
}

/**
 * Generates two similar JavaScript code snippets.
 *
 * @param maxLines - Maximum number of lines the base code will have.
 * @param maxDiff - Maximum number of diff operations to apply to the second snippet.
 *                  Each diff operation may be:
 *                    • Insertion: inserting a new randomly generated line.
 *                    • Deletion: deleting an existing line.
 *                    • Modification: replacing one word in a randomly selected line.
 *
 * @returns An object with properties code1 and code2 which are the two code snippets.
 */
export function generateSimilarJsCode(
  maxLines: number,
  maxDiff: number
): { code1: string; code2: string } {
  // 1. Generate a base random code snippet with exactly maxLines lines.
  const baseCodeLines: string[] = [];
  for (let i = 0; i < maxLines; i++) {
    baseCodeLines.push(generateRandomLine());
  }

  // Clone base code for the first snippet.
  const code1Lines = [...baseCodeLines];

  // 2. Clone base code to generate code2, which we will modify.
  const code2Lines = [...baseCodeLines];

  // 3. Apply up to maxDiff random diff operations on code2.
  // We perform a random number of diffs, not exceeding maxDiff.
  const diffCount = randomInt(1, maxDiff);
  for (let i = 0; i < diffCount; i++) {
    // Choose a diff operation: 0 = insertion, 1 = deletion, 2 = word modification.
    const op = randomInt(0, 2);

    if (op === 0) {
      // Insertion: insert a new randomly generated line at a random position.
      const newLine = generateRandomLine();
      const insertPos = randomInt(0, code2Lines.length);
      code2Lines.splice(insertPos, 0, newLine);
    } else if (op === 1) {
      // Deletion: remove a random line if there's at least one line.
      if (code2Lines.length > 0) {
        const deletePos = randomInt(0, code2Lines.length - 1);
        code2Lines.splice(deletePos, 1);
      }
    } else {
      // Modification: change one random word in a random line.
      if (code2Lines.length > 0) {
        const lineIndex = randomInt(0, code2Lines.length - 1);
        const line = code2Lines[lineIndex];
        // Split the line into words (ignoring punctuation normally).
        const words = line.replace(/;/g, "").split(" ");
        if (words.length > 0) {
          const wordIndex = randomInt(0, words.length - 1);
          // Replace the word with another random word.
          words[wordIndex] = randomWord();
          // Rebuild the line and preserve the semicolon formatting.
          code2Lines[lineIndex] =
            words.join(" ") + (line.trim().endsWith(";") ? ";" : "");
        }
      }
    }
  }

  // 4. Join lines to form the two code strings.
  const code1 = code1Lines.join("\n");
  const code2 = code2Lines.join("\n");

  return { code1, code2 };
}

// Example usage:
const { code1, code2 } = generateSimilarJsCode(10, 3);
console.log("Code 1:\n", code1);
console.log("\nCode 2:\n", code2);
