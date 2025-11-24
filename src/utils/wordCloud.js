export function generateWordFrequency(text) {
  const clean = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3);

  const freq = {};

  clean.forEach((word) => {
    freq[word] = (freq[word] || 0) + 1;
  });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30) // top 30
    .map(([word, count]) => ({
      word,
      size: 10 + count * 4,
    }));
}
