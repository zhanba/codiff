import { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import "./App.css";
import { linesDiffComputers } from "codiff";

function App() {
  const [origin, setOrigin] = useState<string>("wewew");
  const [modified, setModified] = useState<string>("fdfd");
  const [diff, setDiff] = useState<string>();

  useEffect(() => {
    const result = linesDiffComputers
      .getDefault()
      .computeDiff(origin.split("\n"), modified.split("\n"), {
        computeMoves: true,
        ignoreTrimWhitespace: true,
        maxComputationTimeMs: 100,
      });
    setDiff(JSON.stringify(result, undefined, 2));
  }, [origin, modified]);

  return (
    <div className="playground">
      <div className="header">Codiff Playground</div>
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
