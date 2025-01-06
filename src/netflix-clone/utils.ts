export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

// truncateText function
// Truncate text to a certain number of words
// If the text is longer than the word limit, truncate it and add "..."
export const truncateText = (text: string | undefined, wordLimit: number) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(" ") + "...";
  }
  return text;
};
