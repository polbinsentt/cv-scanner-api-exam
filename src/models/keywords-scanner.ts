import * as admin from "firebase-admin";

export interface Keyword {
  id?: string;
  name: string;
  isActive?: boolean;
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}

export interface Scan {
  email: string;
  extractedName: string | null;
  matchedKeywords: string[] | [];
  fullText: string;
  scannedAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}
