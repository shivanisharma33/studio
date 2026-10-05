import { films, type Film } from "@/content/site";

/**
 * Resolves real film titles from YouTube's oEmbed endpoint at build time
 * (revalidated daily). Films whose title cannot be resolved keep `null` and
 * are rendered as a numbered film — a title is never invented.
 */
export async function getFilms(): Promise<Film[]> {
  return films.map((f) => ({ id: f.id, title: f.title }));
}

/** "Parth & Zeal — Mehndi Ceremony" style display split of a raw YouTube title. */
export function splitTitle(title: string): { main: string; sub: string | null } {
  const parts = title
    .split("||")
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !/studio kunal/i.test(p));
  if (parts.length === 0) return { main: title, sub: null };
  return { main: parts[0], sub: parts.slice(1).join(" · ") || null };
}
