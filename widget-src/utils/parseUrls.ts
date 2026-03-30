const URL_REGEX = /https?:\/\/[^\s"'<>)\]]+/gi;

// Trailing sentence punctuation that is not part of the URL itself.
// Quotes are intentionally excluded here because URL_REGEX already stops at " and '.
const TRAILING_PUNCT_REGEX = /[.,;:!?]+$/;

// Truncation suffix added by markdown renderers when a URL is too long to display.
// Handles both the Unicode ellipsis character (…) and three ASCII dots (...).
const TRUNCATION_SUFFIX_REGEX = /(\.\.\.|…)$/;

/**
 * Extracts all URLs found in a text string.
 * Strips trailing sentence punctuation from each match, then deduplicates.
 * This handles markdown-style text where the same URL may appear as both a
 * bare link and inside parentheses, e.g.:
 *   "label https://example.com/path (https://example.com/path)"
 * It also handles markdown-truncated URLs: when one URL ends with "..." or "…",
 * the next URL is treated as the full version and replaces the truncated one.
 */

export function extractUrls(text: string): string[] {
  const matches = text.match(URL_REGEX);
  if (!matches) return [];

  // Process each raw URL match in sequence, tracking the last truncated URL's prefix
  // so we can replace it with the full URL that follows it.
  const result: string[] = [];
  let lastTruncatedPrefix: string | null = null;

  for (const raw of matches) {
    // Detect truncation BEFORE stripping trailing punctuation, because TRAILING_PUNCT_REGEX
    // would otherwise consume "..." and we'd lose the truncation marker.
    const truncationMatch = TRUNCATION_SUFFIX_REGEX.exec(raw);
    const isTruncated = truncationMatch !== null;
    const withoutTrunc = isTruncated ? raw.slice(0, raw.length - truncationMatch![0].length) : raw;
    // Strip remaining trailing sentence punctuation (commas, periods, etc.)
    const url = withoutTrunc.replace(TRAILING_PUNCT_REGEX, '');

    if (lastTruncatedPrefix !== null && url.includes(lastTruncatedPrefix)) {
      // This URL is the full version of the previous truncated one; replace it.
      result[result.length - 1] = url;
    } else if (!result.includes(url)) {
      result.push(url);
    }

    lastTruncatedPrefix = isTruncated ? url : null;
  }
  return result;
}

/**
 * Returns a display-friendly label for a URL:
 * strips the protocol and truncates long paths.
 */
export function formatUrlLabel(url: string, maxLength = 50): string {
  const stripped = url.replace(/^https?:\/\//, '');
  return stripped.length > maxLength ? stripped.slice(0, maxLength) + '…' : stripped;
}
