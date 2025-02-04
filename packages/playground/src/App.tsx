import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import "./App.css";
import { linesDiffComputers } from "codiff";

function generate(n = 100) {
  const len = Math.ceil(Math.sqrt(n)) * 5 + 5;
  let str = "";
  for (let j = 0; j < len; j++)
    str += "  abcdefghij"[Math.floor(Math.random() * 12)];
  let changed = "",
    skipped = 0,
    inserted = 0;
  for (let pos = 0; ; ) {
    if (pos >= len) break;
    const skip = Math.floor(Math.random() * 10) + 1;
    skipped += Math.min(skip, len - pos);
    changed += str.slice(pos, pos + skip);
    pos += skip;
    if (pos >= len) break;
    const insert = Math.floor(Math.random() * 5);
    inserted += insert;
    changed += "X".repeat(insert);
    pos += Math.floor(Math.random() * 5);
  }

  return [str, changed, skipped, inserted] as const;
}

function App() {
  const [origin, setOrigin] = useState<string>("wewew");
  const [modified, setModified] = useState<string>("fdfd");
  const [diff, setDiff] = useState<string>();
  const [diffms, setDiffms] = useState<string>();

  const handleGenerate = () => {
    const [origin, modified] = generate();
    setOrigin(origin);
    setModified(modified);
  };

  useEffect(() => {
    handleGenerate();
  }, []);

  useEffect(() => {
    const start = performance.now();
    const result = linesDiffComputers
      .getDefault()
      .computeDiff(origin.split("\n"), modified.split("\n"), {
        computeMoves: true,
        ignoreTrimWhitespace: true,
        maxComputationTimeMs: 100,
      });
    const end = performance.now();
    setDiffms((end - start).toFixed(3));
    setDiff(JSON.stringify(result, undefined, 2));
  }, [origin, modified]);

  return (
    <div className="playground">
      <div className="header">
        <div>Codiff Playground</div>
        <div className="toolbar">
          <button onClick={() => handleGenerate()}>Generate</button>
          <div>time: {diffms} ms</div>
        </div>
      </div>
      <div className="content">
        <div className="code">
          <CodeMirror
            value={origin}
            onChange={(val) => setOrigin(val)}
            theme={"dark"}
            className="editor"
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages }),
            ]}
          />
        </div>
        <div className="code">
          <CodeMirror
            value={modified}
            onChange={(val) => setModified(val)}
            theme={"dark"}
            className="editor"
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages }),
            ]}
          />
        </div>
        <div className="code">
          <CodeMirror
            value={diff}
            theme={"dark"}
            className="editor"
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages }),
            ]}
          />
        </div>
      </div>
      <div className="footer">header</div>
    </div>
  );
}

export default App;
