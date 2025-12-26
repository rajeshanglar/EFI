/**
 * Strips HTML tags and entities from a string, returning only the text content
 * @param html - The HTML string to strip
 * @returns Plain text without HTML tags
 */
export const stripHtml = (html: string | null | undefined): string => {
  if (!html) return '';

  // Remove HTML tags using regex
  let text = html.replace(/<[^>]*>/g, '');

  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '...');

  // Clean up multiple spaces and trim
  text = text.replace(/\s+/g, ' ').trim();

  return text;
};

