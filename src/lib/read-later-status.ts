import type { ReadLaterCard } from "./extract-article";

export const READ_LATER_STORAGE_KEY = "technews-read-later";

export function loadReadLaterItems(): ReadLaterCard[] {
  try {
    const raw = localStorage.getItem(READ_LATER_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed.filter(
      (item): item is ReadLaterCard =>
        Boolean(
          item &&
            typeof item === "object" &&
            typeof (item as ReadLaterCard).id === "string" &&
            typeof (item as ReadLaterCard).title === "string" &&
            typeof (item as ReadLaterCard).source_url === "string",
        ),
    );
  } catch {
    return [];
  }
}

export function saveReadLaterItems(items: ReadLaterCard[]) {
  const unique = new Map<string, ReadLaterCard>();
  for (const item of items) {
    if (!item?.id) {
      continue;
    }
    unique.set(item.id, {
      ...item,
      category: item.category || "Read later",
      url: item.url || `/read-later/${item.id}/`,
    });
  }
  localStorage.setItem(
    READ_LATER_STORAGE_KEY,
    JSON.stringify([...unique.values()]),
  );
}

export function upsertReadLaterItem(item: ReadLaterCard) {
  const items = loadReadLaterItems().filter((entry) => entry.id !== item.id);
  items.unshift(item);
  saveReadLaterItems(items);
}

export function removeReadLaterItem(id: string) {
  saveReadLaterItems(loadReadLaterItems().filter((item) => item.id !== id));
}
