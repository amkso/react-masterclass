export function makeImagePath(id: string, format?: string) {
  return id
    ? `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`
    : `https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg`;
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
