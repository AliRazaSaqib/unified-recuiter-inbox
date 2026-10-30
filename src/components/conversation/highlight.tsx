import { useMemo } from "react";

interface HighlightProps {
  text: string;
  query: string;
}

export function Highlight({ text, query }: HighlightProps) {
  const parts = useMemo(() => {
    const needle = query.trim();
    if (!needle) return [{ text, match: false }];

    const result: { text: string; match: boolean }[] = [];
    const lower = text.toLowerCase();
    const target = needle.toLowerCase();
    let cursor = 0;

    while (cursor < text.length) {
      const index = lower.indexOf(target, cursor);
      if (index === -1) {
        result.push({ text: text.slice(cursor), match: false });
        break;
      }
      if (index > cursor) result.push({ text: text.slice(cursor, index), match: false });
      result.push({ text: text.slice(index, index + target.length), match: true });
      cursor = index + target.length;
    }

    return result;
  }, [text, query]);

  return (
    <>
      {parts.map((part, index) =>
        part.match ? (
          <mark
            key={index}
            className="rounded-[3px] bg-warning-soft px-0.5 text-warning"
          >
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}
