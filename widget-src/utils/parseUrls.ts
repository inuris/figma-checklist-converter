const URL_REGEX = /https?:\/\/[^\s"'<>)\]]+/gi;

// Trailing sentence punctuation that is not part of the URL itself.
// Quotes are intentionally excluded here because URL_REGEX already stops at " and '.
const TRAILING_PUNCT_REGEX = /[.,;:!?]+$/;

/**
 * Extracts all URLs found in a text string.
 * Strips trailing sentence punctuation from each match, then deduplicates.
 * This handles markdown-style text where the same URL may appear as both a
 * bare link and inside parentheses, e.g.:
 *   "label https://example.com/path (https://example.com/path)"
 */
export function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);
  if (!matches) return [];
  // Strip trailing punctuation so "https://x.com," and "https://x.com" are treated as the same URL
  const normalizedUrls = matches.map(url => url.replace(TRAILING_PUNCT_REGEX, ''));
  // Deduplicate while preserving order
  return [...new Set(normalizedUrls)];
}

/**
 * Returns a display-friendly label for a URL:
 * strips the protocol and truncates long paths.
 */
export function formatUrlLabel(url: string, maxLength = 50): string {
  const stripped = url.replace(/^https?:\/\//, '');
  return stripped.length > maxLength ? stripped.slice(0, maxLength) + '…' : stripped;
}
