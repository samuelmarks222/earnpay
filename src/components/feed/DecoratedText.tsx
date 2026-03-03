import * as React from "react";

type Props = {
  text: string;
};

// Simple tokenizer that renders:
// - bold segments wrapped with a bold style (/**bold***/ handled via **bold** syntax)
// - hashtags like #tag with a decorative badge
// - mentions like @user with a badge
// - links as clickable blue underlined text
// - plain text as default
const DecoratedText: React.FC<Props> = ({ text }) => {
  // First, handle bold segments with **bold** syntax
  const segments: { type: "plain" | "bold"; value: string }[] = [];
  let lastIndex = 0;
  const boldRe = /\*\*(.+?)\*\*/g;
  let m: RegExpExecArray | null;
  while ((m = boldRe.exec(text)) !== null) {
    if (m.index > lastIndex) {
      segments.push({ type: "plain", value: text.substring(lastIndex, m.index) });
    }
    segments.push({ type: "bold", value: m[1] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "plain", value: text.substring(lastIndex) });
  }

  // Now split plain segments further into links, hashtags, and mentions
  const renderParts: React.ReactNode[] = [];
  let keyCounter = 0;
  const pushPlain = (s: string) => renderParts.push(<span key={keyCounter++}>{s}</span>);

  const tokenRe = /(https?:\/\/[^\s]+)|(#[\w-]+)|(@[\w.-]+)/g;
  for (const seg of segments) {
    if (seg.type === "bold") {
      renderParts.push(<span key={keyCounter++} className="font-semibold">{seg.value}</span>);
      continue;
    }
    // seg.type === 'plain'
    const plain = seg.value;
    let last = 0;
    let tok: RegExpExecArray | null;
    while ((tok = tokenRe.exec(plain)) !== null) {
      if (tok.index > last) {
        pushPlain(plain.substring(last, tok.index));
      }
      const token = tok[0];
      if (token.startsWith("http")) {
        renderParts.push(
          <a key={keyCounter++} href={token} target="_blank" rel="noreferrer" className="text-teal-700 underline">
            {token}
          </a>
        );
      } else if (token.startsWith("#")) {
        renderParts.push(
          <span key={keyCounter++} className="inline-flex items-center bg-rose-100 text-rose-700 text-xs px-2 py-0.5 rounded-full mx-1">
            {token}
          </span>
        );
      } else if (token.startsWith("@")) {
        renderParts.push(
          <span key={keyCounter++} className="inline-flex items-center bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full mx-1">
            {token}
          </span>
        );
      }
      last = tok.index + token.length;
    }
    if (last < plain.length) {
      pushPlain(plain.substring(last));
    }
  }

  return <span className="leading-relaxed">{renderParts}</span>;
};

export default DecoratedText;
