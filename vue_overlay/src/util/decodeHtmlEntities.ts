export default function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&comma;/g, ',')
    .replace(/&apos;/g, "'")
    .replace(/&mdash;/g, '-')
    .replace(/&ndash;/g, '-')
    .replace(/&amp;/g, '&');
}
