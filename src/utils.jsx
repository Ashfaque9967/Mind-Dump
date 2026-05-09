export function extractTags(text) {
  const matches = text.match(/#\w+/g);
  if (!matches) return [];
  return [...new Set(matches.map((t) => t.toLowerCase()))];
}

export function highlightTags(text, cardBg) {
  // Light cards get dark tag color, dark/red cards get white
  const lightCards = ["#F5C800", "#00C897", "#C77DFF", "#FF85A1"];
  const tagColor = lightCards.includes(cardBg)
    ? "rgba(0,0,0,0.45)"
    : "rgba(255,255,255,0.75)";
  return text.replace(
    /#\w+/g,
    (tag) => `<span style="opacity:0.75;font-weight:700">${tag}</span>`,
  );
}

export function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
