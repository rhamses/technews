export const READ_STORAGE_KEY = "technews-read";

export function loadReadIds(): string[] {
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((id): id is string => typeof id === "string" && id.length > 0)
      : [];
  } catch {
    return [];
  }
}

export function saveReadIds(ids: string[]) {
  localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(ids));
}
