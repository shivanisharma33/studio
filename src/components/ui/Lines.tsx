import type { CSSProperties, ElementType } from "react";

type Props = {
  lines: string[];
  as?: ElementType;
  className?: string;
  lineClassName?: string;
  style?: CSSProperties;
  id?: string;
};

/**
 * Renders text as masked lines so GSAP can slide each line up into view.
 * Markup is semantic (one heading, several visual lines).
 */
export default function Lines({ lines, as: Tag = "span", className, lineClassName, style, id }: Props) {
  return (
    <Tag className={["lines", className].filter(Boolean).join(" ")} style={style} id={id}>
      {lines.map((l, i) => (
        <span className={["line", lineClassName].filter(Boolean).join(" ")} key={i} aria-hidden={false}>
          <span>{l}</span>
        </span>
      ))}
    </Tag>
  );
}
