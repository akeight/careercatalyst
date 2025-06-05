export function normalizeLinkedIn(url: string | undefined): string | undefined {
  if (!url) return undefined;

  try {
    const cleanUrl = new URL(url);
    return cleanUrl.origin + cleanUrl.pathname; // Removes query strings like ?utm_source=...
  } catch {
    return url; // fallback if it’s not a valid URL
  }
}
