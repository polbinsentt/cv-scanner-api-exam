import { fetchActiveKeywords } from "./activeKeywords";

//finds active keywords that cvtext contains
export const matchedKeywords = async (text: string): Promise<string[]> => {
  const activeKeywords = await fetchActiveKeywords();
  const cvText = text.toLowerCase();

  const matchedKeywords =
    activeKeywords
      ?.filter((keyword) => cvText.includes(keyword.name as string))
      .map((keyword) => keyword.name as string) || [];

  return matchedKeywords;
};
