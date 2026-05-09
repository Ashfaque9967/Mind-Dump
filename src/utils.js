export function extractTags(text) {
  const matches = text.match(/#\w+/g); 
  if (!matches) return []; 
  return [...new Set(matches.map((t) => t.toLowerCase()))]; 
}

export function highlightTags(text) {
  return text.replace(/#\w+/g, (tag) => {
    return `<span style="color:#60a5fa;font-weight:500">${tag}</span>`;
  });
}
