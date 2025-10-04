import { getDb } from "../configs/firebase";
import * as admin from "firebase-admin";
import { Scan } from "../models/keywords-scanner";

//Stores batch scan results to firebase
const collectionName = "batch"; // Minimal change from storeScanResult function, just changed the collection name
export const storeBatchResult = async (scan: Scan) => {
  try {
    const db = getDb();
    const scanBatchRef = db.collection(collectionName).doc(scan.email);
    await scanBatchRef.set({
      ...scan,
      scannedAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });
    return {
      id: scanBatchRef.id,
      ...scan,
      scannedAt: admin.firestore.Timestamp.now().toDate().toISOString(),
      updatedAt: admin.firestore.Timestamp.now().toDate().toISOString(),
    };
  } catch (err) {
    console.error("Error saving batch scan:", err);
    throw err;
  }
};
