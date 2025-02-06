type CodePair = {
  codeA: string;
  codeB: string;
};

const VAR_NAME_REGEX = /^var\d+$/;
const NUMBER_REGEX = /^\d+$/;
const STRING_REGEX = /^'[^']*'$/;

export function generateSimilarCode(
  maxLines: number,
  maxDiffs: number
): CodePair {
  // Generate base code
  const codeA = generateBaseCode(maxLines);
  const codeB = [...codeA];
  let remainingDiffs = maxDiffs;

  while (remainingDiffs > 0 && codeB.length > 0) {
    const operation = randomOperation(codeB.length, maxLines);

    switch (operation) {
      case "insert":
        codeB.splice(randomIndex(codeB.length + 1), 0, generateLine());
        remainingDiffs--;
        break;

      case "delete":
        codeB.splice(randomIndex(codeB.length), 1);
        remainingDiffs--;
        break;

      case "modify": {
        const idx = randomIndex(codeB.length);
        const original = codeB[idx];
        const modified = modifyLine(original);
        if (modified !== original) {
          codeB[idx] = modified;
          remainingDiffs--;
        }
        break;
      }
    }
  }

  return {
    codeA: codeA.join("\n"),
    codeB: codeB.join("\n"),
  };
}

function generateBaseCode(lineCount: number): string[] {
  return Array.from({ length: lineCount }, () => generateLine());
}

function generateLine(): string {
  const generators = [
    generateVariableDeclaration,
    generateFunction,
    generateArrowFunction,
    generateForLoop,
    generateIfStatement,
    generateConsoleLog,
    generateObjectLiteral,
    generateAssignment,
  ];
  return generators[Math.floor(Math.random() * generators.length)]();
}

function generateVariableDeclaration(): string {
  return `let var${Math.floor(Math.random() * 1000)} = ${generateValue()};`;
}

function generateFunction(): string {
  const params = ["a", "b", "c"].slice(0, Math.floor(Math.random() * 3));
  return `function func${Math.floor(Math.random() * 1000)}(${params.join(", ")}) { return ${params.join(" + ")} || 0; }`;
}

function generateArrowFunction(): string {
  return `const fn${Math.floor(Math.random() * 1000)} = () => ${generateValue()};`;
}

function generateForLoop(): string {
  const varName = `i${Math.floor(Math.random() * 1000)}`;
  return `for (let ${varName} = 0; ${varName} < ${Math.floor(Math.random() * 10)}; ${varName}++) { /* loop */ }`;
}

function generateIfStatement(): string {
  return `if (var${Math.floor(Math.random() * 1000)} > ${Math.floor(Math.random() * 50)}) { /* condition */ }`;
}

function generateConsoleLog(): string {
  return `console.log('${Math.random().toString(36).substring(7)}');`;
}

function generateObjectLiteral(): string {
  return `const obj${Math.floor(Math.random() * 1000)} = { prop: ${generateValue()} };`;
}

function generateAssignment(): string {
  return `var${Math.floor(Math.random() * 1000)} = ${generateValue()};`;
}

function generateValue(): string {
  const types = ["number", "string", "array", "object"];
  switch (types[Math.floor(Math.random() * types.length)]) {
    case "number":
      return `${Math.floor(Math.random() * 100)}`;
    case "string":
      return `'${Math.random().toString(36).substring(7)}'`;
    case "array":
      return `[${Array.from({ length: 3 }, generateValue).join(", ")}]`;
    case "object":
      return `{ key: ${generateValue()} }`;
    default:
      return "null";
  }
}

function modifyLine(line: string): string {
  const tokens = line.split(/(\s+|\W)/).filter((t) => t.trim().length > 0);
  const candidates = tokens
    .map((t, i) => ({ t, i }))
    .filter(({ t }) => isModifiable(t));

  if (candidates.length === 0) return line;

  const { t, i } = candidates[Math.floor(Math.random() * candidates.length)];
  tokens[i] = modifyToken(t);
  return tokens.join("");
}

function isModifiable(token: string): boolean {
  return (
    VAR_NAME_REGEX.test(token) ||
    NUMBER_REGEX.test(token) ||
    STRING_REGEX.test(token)
  );
}

function modifyToken(token: string): string {
  if (VAR_NAME_REGEX.test(token)) {
    return `var${Math.floor(Math.random() * 1000)}`;
  }
  if (NUMBER_REGEX.test(token)) {
    return `${Math.floor(Math.random() * 100)}`;
  }
  if (STRING_REGEX.test(token)) {
    return `'${Math.random().toString(36).substring(7)}'`;
  }
  return token;
}

type Operation = "insert" | "delete" | "modify";

function randomOperation(currentLines: number, maxLines: number): Operation {
  const options: Operation[] = [];
  if (currentLines < maxLines * 1.5) options.push("insert");
  if (currentLines > Math.floor(maxLines / 2)) options.push("delete");
  options.push("modify");
  return options[Math.floor(Math.random() * options.length)];
}

function randomIndex(max: number): number {
  return Math.floor(Math.random() * max);
}
