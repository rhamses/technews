export const SAVED_STORAGE_KEY = "technews-saved";

export function loadSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(SAVED_STORAGE_KEY);
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

export function saveSavedIds(ids: string[]) {
  localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(ids));
}
