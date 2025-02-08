# Codiff

Codiff is a library for computing line by line diff using the same diff algorithms in VSCode.

## Install

```sh
npm install codiff
```

# Usage

```typescript
import { linesDiffComputers } from "codiff";

const doc = `one
two
three
four
five`;

const docModified = doc.replace(/t/g, "T") + "\nSix";

const diffResult = linesDiffComputers
  .getDefault()
  .computeDiff(doc, docModified, {
    computeMoves: true,
    ignoreTrimWhitespace: true,
    maxComputationTimeMs: 100,
  });
```

diff result:

```json
{
  "changes": [
    {
      "original": {
        "startLineNumber": 2,
        "endLineNumberExclusive": 4
      },
      "modified": {
        "startLineNumber": 2,
        "endLineNumberExclusive": 4
      },
      "innerChanges": [
        {
          "originalRange": {
            "startLineNumber": 2,
            "startColumn": 1,
            "endLineNumber": 2,
            "endColumn": 2
          },
          "modifiedRange": {
            "startLineNumber": 2,
            "startColumn": 1,
            "endLineNumber": 2,
            "endColumn": 2
          }
        },
        {
          "originalRange": {
            "startLineNumber": 3,
            "startColumn": 1,
            "endLineNumber": 3,
            "endColumn": 2
          },
          "modifiedRange": {
            "startLineNumber": 3,
            "startColumn": 1,
            "endLineNumber": 3,
            "endColumn": 2
          }
        }
      ]
    },
    {
      "original": {
        "startLineNumber": 6,
        "endLineNumberExclusive": 6
      },
      "modified": {
        "startLineNumber": 6,
        "endLineNumberExclusive": 7
      },
      "innerChanges": [
        {
          "originalRange": {
            "startLineNumber": 5,
            "startColumn": 5,
            "endLineNumber": 5,
            "endColumn": 5
          },
          "modifiedRange": {
            "startLineNumber": 5,
            "startColumn": 5,
            "endLineNumber": 6,
            "endColumn": 4
          }
        }
      ]
    }
  ],
  "moves": [],
  "hitTimeout": false
}
```

## Playground

Codiff provide a [playground](https://zhanba.github.io/codiff/) to test the diff algorithm and preview the diff result in code diff editor and JSON editor.

## Performance

- Diff performance is related to the number of lines of code and the number of changes.
- Suggestion:
  - Cache the diff result for same content.
  - Use wroker to do the diff in the background.
