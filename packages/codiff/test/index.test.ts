import { describe, it, expect } from "vitest";
import { Codiff } from "../src/codiff";

describe("Codiff", () => {
  it("should create an instance of Codiff", () => {
    const codiff = new Codiff();
    expect(codiff).toBeInstanceOf(Codiff);
  });

  it("should correctly compute the diff between two strings", () => {
    const codiff = new Codiff();
    const result = codiff.computeDiff(
      `one
two
three
four
five`,
      `one
Two
Three
four
five
Six`
    );
    expect(result.changes).toEqual([
      {
        original: {
          startLineNumber: 2,
          endLineNumberExclusive: 4,
        },
        modified: {
          startLineNumber: 2,
          endLineNumberExclusive: 4,
        },
        innerChanges: [
          {
            originalRange: {
              startLineNumber: 2,
              startColumn: 1,
              endLineNumber: 2,
              endColumn: 2,
            },
            modifiedRange: {
              startLineNumber: 2,
              startColumn: 1,
              endLineNumber: 2,
              endColumn: 2,
            },
          },
          {
            originalRange: {
              startLineNumber: 3,
              startColumn: 1,
              endLineNumber: 3,
              endColumn: 2,
            },
            modifiedRange: {
              startLineNumber: 3,
              startColumn: 1,
              endLineNumber: 3,
              endColumn: 2,
            },
          },
        ],
      },
      {
        original: {
          startLineNumber: 6,
          endLineNumberExclusive: 6,
        },
        modified: {
          startLineNumber: 6,
          endLineNumberExclusive: 7,
        },
        innerChanges: [
          {
            originalRange: {
              startLineNumber: 5,
              startColumn: 5,
              endLineNumber: 5,
              endColumn: 5,
            },
            modifiedRange: {
              startLineNumber: 5,
              startColumn: 5,
              endLineNumber: 6,
              endColumn: 4,
            },
          },
        ],
      },
    ]);
  });

  it("should return an empty array when there are no differences", () => {
    const codiff = new Codiff();
    const result = codiff.computeDiff("same", "same");
    expect(result.changes).toEqual([]);
  });

  it("complex case snapshot", () => {
    const original = `for (let i722 = 0; i722 < 7; i722++) { /* loop */ }
    const fn114 = () => ['4f7omf', 'yq7ukl', 27];
    console.log('dunrt');
    const obj259 = { prop: { key: { key: 'yk4pen' } } };
    const fn719 = () => { key: 'wry0ki' };
    console.log('0t7o5');
    for (let i139 = 0; i139 < 7; i139++) { /* loop */ }
    console.log('112sqm');
    function func387(a, b) { return a + b || 0; }
    let var276 = { key: 54 };
    let var778 = '1x6xti';
    const fn765 = () => 27;
    function func544(a) { return a || 0; }
    function func170(a, b) { return a + b || 0; }
    if (var254 > 24) { /* condition */ }
    if (var252 > 47) { /* condition */ }
    if (var679 > 21) { /* condition */ }
    const obj943 = { prop: ['lharbc', 'r3iag', 90] };
    if (var818 > 6) { /* condition */ }
    const fn771 = () => { key: { key: [{ key: '0yrfhj' }, 91, '3z09h'] } };
    function func103(a) { return a || 0; }
    function func641(a) { return a || 0; }
    var71 = 16;
    function func21(a) { return a || 0; }
    if (var924 > 25) { /* condition */ }
    const obj582 = { prop: 49 };
    for (let i905 = 0; i905 < 1; i905++) { /* loop */ }
    var522 = 5;
    var349 = { key: { key: 'hnx7g' } };
    let var808 = [40, 'nrp50i', [29, 61, '2it09r']];`;

    const modified = `for (let i722 = 0; i722 < 7; i722++) { /* loop */ }
    function func374(a) { return a || 0; }
    const fn946 = () => 'o5abb2c';
    const obj256 = { prop: { key: 20 } };
    const fn114 = () => ['4f7omf', 'yq7ukl', 27];
    console.log('dunrt');
    const obj259 = { prop: { key: { key: 'yk4pen' } } };
    const obj724 = { prop: { key: 'qeabja' } };
    const fn719 = () => { key: 'wry0ki' };
    console.log('0t7o5');
    function func126(a, b) { return a + b || 0; }
    const fn158 = () => { key: 'gxyikw' };
    function func152(a, b) { return a + b || 0; }
    for(leti139=0;i139<29;i139++){/*loop*/}
    for (let i182 = 0; i182 < 2; i182++) { /* loop */ }
    functionfunc387(a,b){returna+b||49;}
    let var276 = { key: 54 };
    letvar404='1x6xti';
    const fn765 = () => 27;
    functionfunc544(a){returna||61;}
    functionfunc170(a,b){returna+b||71;}
    if (var254 > 24) { /* condition */ }
    if (var252 > 47) { /* condition */ }
    if (var499 > 23) { /* condition */ }
    if (var679 > 21) { /* condition */ }
    if (var818 > 6) { /* condition */ }
    const fn771 = () => { key: { key: [{ key: '0yrfhj' }, 91, '3z09h'] } };
    functionfunc103(a){returna||58;}
    if (var538 > 34) { /* condition */ }
    function func21(a) { return a || 0; }
    if (var924 > 25) { /* condition */ }
    for (let i905 = 0; i905 < 1; i905++) { /* loop */ }
    var522 = 5;
    var349 = { key: { key: 'hnx7g' } };
    let var808 = [40, 'nrp50i', [29, 61, '2it09r']];`;

    const codiff = new Codiff();
    const result = codiff.computeDiff(original, modified);
    expect(result.changes).toMatchSnapshot();
  });
});
