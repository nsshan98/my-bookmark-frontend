"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypeHighlight from "rehype-highlight";
import { saveAs } from "file-saver";
import "highlight.js/styles/github.css"; // syntax highlight theme

export default function MarkdownEditor() {
  const [text, setText] = useState(`# Welcome to Markdown Editor

Type your **Markdown** here!

- Bullet 1
- Bullet 2
1. Numbered 1
2. Numbered 2

\`\`\`js
console.log("Hello World");
\`\`\`
`);
  const [view, setView] = useState<"preview" | "raw">("preview");

  const handleDownload = () => {
    const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
    saveAs(blob, "document.md");
  };

  return (
    <div className=" sm:grid grid-cols-2 gap-4 h-screen">
      {/* Left Panel: Input */}
      <textarea
        className="border p-4 w-full h-full resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter your markdown here..."
      />

      {/* Right Panel: Preview / Raw */}
      <div className="border p-4 h-full overflow-auto flex flex-col">
        {/* Toggle buttons */}
        <div className="mb-2 flex gap-2">
          <button
            onClick={() => setView("preview")}
            className={`px-3 py-1 rounded ${
              view === "preview" ? "bg-blue-500 text-white" : "bg-green-500"
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setView("raw")}
            className={`px-3 py-1 rounded ${
              view === "raw" ? "bg-blue-500 text-white" : "bg-green-500"
            }`}
          >
            Raw
          </button>
          <button
            onClick={handleDownload}
            className="ml-auto px-3 py-1 rounded bg-green-500 text-white"
          >
            Download .md
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          {view === "preview" ? (
            <div className="markdown-preview">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize, rehypeHighlight]}
              >
                {text}
              </ReactMarkdown>
            </div>
          ) : (
            <pre className="whitespace-pre-wrap">{text}</pre>
          )}
        </div>
      </div>
    </div>
  );
}
