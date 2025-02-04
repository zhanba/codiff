import { expect, test } from "vitest";
import { linesDiffComputers } from "./linesDiffComputers";

test("", () => {
  const diff = linesDiffComputers.getDefault();
  const origin = ["abc", "123"];
  const modified = ["acd", "234"];
  const result = diff.computeDiff(origin, modified, {
    computeMoves: true,
    ignoreTrimWhitespace: true,
    maxComputationTimeMs: 100,
  });
  expect(result.changes.length).toBe(2);
});
