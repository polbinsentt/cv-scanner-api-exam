import * as admin from "firebase-admin";

export interface Keyword {
  name: string;
  isActive?: boolean;
  createdAt?: admin.firestore.Timestamp;
  updatedAt?: admin.firestore.Timestamp;
}
