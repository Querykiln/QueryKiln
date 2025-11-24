// Simple local plagiarism approximation — no API
// Compares text against common internet phrases

const commonPhrases = [
  "in conclusion",
  "as a result",
  "in this article",
  "on the other hand",
  "in today's world",
  "the purpose of this",
  "the benefits of",
  "one of the most",
];

export function checkPlagiarism(text) {
  const lower = text.toLowerCase();

  let count = 0;
  commonPhrases.forEach((phrase) => {
    if (lower.includes(phrase)) count++;
  });

  const percentage = Math.min(100, count * 10);

  return {
    matches: count,
    percentage,
    status:
      percentage > 50
        ? "⚠️ High chance of plagiarism"
        : percentage > 20
        ? "🟡 Possible plagiarism"
        : "🟢 Low plagiarism risk",
  };
}
