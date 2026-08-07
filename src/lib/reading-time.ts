const WORDS_PER_MINUTE = 200;

function toPlainText(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function estimateReadingMinutes(parts: Array<string | undefined | null>): number {
  const texts = parts
    .filter((part): part is string => Boolean(part && part.trim()))
    .map(toPlainText)
    .filter(Boolean);

  const text = texts.sort((a, b) => b.length - a.length)[0] ?? "";
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(minutes: number): string {
  return minutes === 1 ? "1 min read" : `${minutes} min read`;
}
