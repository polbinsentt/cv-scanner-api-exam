import { getDb } from "../configs/firebase";

export const fetchActiveKeywords = async () => {
  try {
    const db = getDb();
    const snapshots = await db
      .collection("keywords")
      .where("isActive", "==", true)
      .get();
    if (snapshots.empty) {
      console.log("No keywords");
      return;
    }

    const keywords = snapshots.docs.map((data) => {
      const record = data.data();
      return {
        id: data.id,
        name: record.name,
        isActive: record.isActive,
        createdAt: record.createdAt?.toDate().toISOString(),
        updatedAt: record.updatedAt?.toDate().toISOString(),
      };
    });
    return keywords;
  } catch (err) {
    console.error("Error fetching active keywords:", err);
  }
};
