"use client";

import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

export function CodeEditor({
  value,
  onChange,
  height = "520px",
}: {
  value: string;
  onChange: (value: string) => void;
  height?: string;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-[var(--rule-soft)] bg-dark">
      <MonacoEditor
        height={height}
        defaultLanguage="html"
        theme="vs-dark"
        value={value}
        onChange={(next) => onChange(next ?? "")}
        options={{
          fontFamily: "JetBrains Mono",
          fontSize: 13,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
        }}
      />
    </div>
  );
}
