import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import "./App.css";
import { Codiff } from "codiff";
import { Change, Chunk } from "@codemirror/merge";
import { Text } from "@codemirror/state";
import { generateSimilarCode } from "./util";
import CodeMirrorMerge from "react-codemirror-merge";
import { json } from "@codemirror/lang-json";

const Original = CodeMirrorMerge.Original;
const Modified = CodeMirrorMerge.Modified;

const codiff = new Codiff();

const overrideBuild = () => {
  const buildChunks = (a: Text, b: Text): readonly Chunk[] => {
    console.log("diff compute");
    const result = codiff.computeDiff(a.toString(), b.toString());
    return result.changes.map<Chunk>((item) => {
      const getPosition = (text: Text, from: number, to: number) => {
        if (from === to) {
          // no change
          if (from === 1) {
            return { from: text.line(from).to, to: text.line(from).to };
          }
          return { from: text.line(from - 1).to, to: text.line(from - 1).to };
        }
        return { from: text.line(from).from, to: text.line(to - 1).to };
      };

      const origin = getPosition(
        a,
        item.original.startLineNumber,
        item.original.endLineNumberExclusive
      );

      const modified = getPosition(
        b,
        item.modified.startLineNumber,
        item.modified.endLineNumberExclusive
      );

      const nonNegative = (a: number) => {
        return a < 0 ? 0 : a;
      };

      const changes = (item.innerChanges ?? []).map<Change>((inner) => {
        return {
          fromA: nonNegative(
            a.line(inner.originalRange.startLineNumber).from +
              inner.originalRange.startColumn -
              1 -
              origin.from
          ),
          toA: nonNegative(
            a.line(inner.originalRange.endLineNumber).from +
              inner.originalRange.endColumn -
              1 -
              origin.from
          ),
          fromB: nonNegative(
            b.line(inner.modifiedRange.startLineNumber).from +
              inner.modifiedRange.startColumn -
              1 -
              modified.from
          ),
          toB: nonNegative(
            b.line(inner.modifiedRange.endLineNumber).from +
              inner.modifiedRange.endColumn -
              1 -
              modified.from
          ),
        };
      });

      const chunk = new Chunk(
        changes,
        origin.from,
        origin.to + 1,
        modified.from,
        modified.to + 1
      );
      return chunk;
    });
  };

  Chunk.build = buildChunks;
  Chunk.updateA = (chunks: readonly Chunk[], a: Text, b: Text) =>
    buildChunks(a, b);
  Chunk.updateB = (chunks: readonly Chunk[], a: Text, b: Text) =>
    buildChunks(a, b);
};

overrideBuild();

const doc = `one
two
three
four
five`;

const docModified = doc.replace(/t/g, "T") + "\nSix";

function App() {
  const [origin, setOrigin] = useState<string>(doc);
  const [modified, setModified] = useState<string>(docModified);
  const [diff, setDiff] = useState<string>();
  const [diffms, setDiffms] = useState<string>();

  const [maxLine, setMaxLine] = useState(20);
  const [maxDiff, setMaxDiff] = useState(10);

  const handleGenerate = () => {
    const { codeA: origin, codeB: modified } = generateSimilarCode(
      maxLine,
      maxDiff
    );
    setOrigin(origin);
    setModified(modified);
  };

  useEffect(() => {
    const start = performance.now();
    const result = codiff.computeDiff(origin, modified);
    const end = performance.now();
    setDiffms((end - start).toFixed(3));
    setDiff(JSON.stringify(result, undefined, 2));
  }, [origin, modified]);

  return (
    <div className="playground">
      <div className="header">
        <div>Codiff Playground</div>
        <div className="toolbar">
          <button onClick={() => handleGenerate()}>Generate code</button>
          <span>
            maxLine:
            <input
              value={maxLine}
              onChange={(e) => setMaxLine(parseInt(e.target.value))}
            />
          </span>
          <span>
            maxDiff:
            <input
              value={maxDiff}
              onChange={(e) => setMaxDiff(parseInt(e.target.value))}
            />
          </span>
        </div>
      </div>
      <div className="content">
        <div className="code">
          <CodeMirrorMerge theme={"dark"} destroyRerender={false}>
            <Original
              value={origin}
              onChange={(val) => {
                setOrigin(val);
              }}
              key={origin}
            />
            <Modified
              key={modified}
              value={modified}
              onChange={(val) => setModified(val)}
            />
          </CodeMirrorMerge>
        </div>
        <div className="result">
          <CodeMirror
            value={diff}
            theme={"dark"}
            className="editor"
            extensions={[json()]}
          />
        </div>
      </div>
      <div className="footer">
        <div className="links">
          <a href="https://github.com/zhanba/codiff" target="_blank">
            codiff repo
          </a>
          <a
            href="https://microsoft.github.io/monaco-editor/playground.html?source=v0.52.2#example-creating-the-diffeditor-hello-diff-world"
            target="_blank"
          >
            monaco diff editor
          </a>
          <a
            href="https://codemirror.net/try/#example=Merge%20View"
            target="_blank"
          >
            codemirror merge editor
          </a>
        </div>
        <div>diff used: {diffms} ms</div>
      </div>
    </div>
  );
}

export default App;
