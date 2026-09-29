export default function Arrow({ dir = "right" }: { dir?: "right" | "left" | "down" }) {
  const glyph = dir === "left" ? "←" : dir === "down" ? "↓" : "→";
  return (
    <span className="arrow" aria-hidden="true">
      {glyph}
    </span>
  );
}
