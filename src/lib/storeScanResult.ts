import { getDb } from "../configs/firebase";
import * as admin from "firebase-admin";
import { Scan } from "../models/keywords-scanner";

// Stores scan results to firebase
const collectionName = "scan";
export const storeScanResult = async (scan: Scan) => {
  try {
    const db = getDb();
    const scanRef = db.collection(collectionName).doc(scan.email);
    await scanRef.set({
      ...scan,
      scannedAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    });
    return {
      id: scanRef.id,
      ...scan,
      scannedAt: admin.firestore.Timestamp.now().toDate().toISOString(),
      updatedAt: admin.firestore.Timestamp.now().toDate().toISOString(),
    };
  } catch (err) {
    console.error("Error saving scan:", err);
    throw err;
  }
};
