import { fetchActiveKeywords } from "./activeKeywords";

//finds active keywords that cvtext contains
export const matchedKeywords = async (text: string): Promise<string[]> => {
  // if (!text) {
  //   throw new Error(`Error: no text provided`);
  // }
  // if (!text) return []; // return empty instead of crashing
  const activeKeywords = await fetchActiveKeywords();
  const cvText = text.toLowerCase();

  const matchedKeywords =
    activeKeywords
      ?.filter((keyword) => cvText.includes(keyword.name as string))
      .map((keyword) => keyword.name as string) || [];

  return matchedKeywords;
};
