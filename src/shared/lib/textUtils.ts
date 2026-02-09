// Converts strings like 'FILTER_DATA', 'PART_CATEGORY', 'ALFA_ROMEO' to 'Filter Data', 'Part Category', 'Alfa Romeo'
export function toHumanReadable(text: string): string {
  if (!text) return "";
  return text
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
