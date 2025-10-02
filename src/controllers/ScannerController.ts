import { Request, Response, NextFunction } from "express";
import pdf from "pdf-parse";
import { findEmail, findName, keywordExist } from "../lib/utils";
import { fetchActiveKeywords } from "../lib/activeKeywords";
import { storeResult } from "../lib/storeResult";
import { getDb } from "../configs/firebase";
import * as admin from "firebase-admin";
// THIS IS A STUB FILE. The applicant needs to implement the logic.

export const scanCv = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No CV file uploaded." });
    }

    // TODO: Implement the full scanning logic as per the README.

    // 1. Extract text from the PDF buffer (req.file.buffer).
    const data = await pdf(req.file.buffer);
    const cvText = data.text;

    // 2. Find email and name from the text.
    const email = findEmail(cvText);
    const name = findName(cvText);

    // 3. Fetch active keywords from Firestore.
    const activeKeywords = await fetchActiveKeywords();

    // 4. Match keywords against the cvText.
    const matchKeywords = await keywordExist(cvText);

    // 5. Save the results to Firestore, using the email as the document ID.
    const scanData = {
      email: email,
      extractedName: name,
      matchedKeywords: matchKeywords,
      fullText: cvText,
    };
    const result = await storeResult(scanData);

    // 6. Return the result.
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const rescanCv = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required for rescan." });
    }

    // TODO: Implement the rescan logic as per the README.
    const collectionName = "scanResults";
    const db = getDb();

    // 1. Find the CV document in Firestore by email.
    const scanRef = db.collection(collectionName).doc(req.body.email);
    const data = await scanRef.get();
    const record = data.data();
    // 2. Fetch active keywords from Firestore.
    const latestActiveKeywords = await fetchActiveKeywords();

    // 3. Re-run matching logic on the stored `fullText`.
    const matchedKeywords = await keywordExist(record?.fullText);
    // 4. Update the document in Firestore.
    const updateRecord = {
      matchedKeywords: matchedKeywords,
      updatedAt: admin.firestore.Timestamp.now(),
    };
    await scanRef.update(updateRecord);
    const updatedSnapshot = await scanRef.get();
    const snap = updatedSnapshot.data();
    const updatedRecord = {
      id: updatedSnapshot.id,
      ...snap,
    };
    // 5. Return the updated document.

    res.json(updatedRecord);
  } catch (error) {
    next(error);
  }
};
