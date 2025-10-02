import { Request, Response, NextFunction } from "express";
import { getDb } from "../configs/firebase";
import { Keyword } from "../models/keywords";
import * as admin from "firebase-admin";

const collectionName = "keywords";

// THIS IS A STUB FILE. The applicant needs to implement the logic.

export const createKeyword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement logic to create a keyword.
    // 1. Validate request body (e.g., ensure 'name' is present).
    // 2. Call a service function to interact with Firestore.
    // 3. Return the newly created keyword with a 201 status code.
    const db = getDb();
    const data: Keyword = req.body;

    if (!data.name) {
      return res.status(404).json({ message: "Name field is required!" });
    }
    const keyword: Keyword = {
      name: data.name,
      isActive: data.isActive ?? true,
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    const docRef = db.collection(collectionName).doc();
    await docRef.set(keyword);

    res.status(201).json({ id: docRef.id, ...keyword });
  } catch (error) {
    next(error);
  }
};

export const getKeywords = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement logic to get all keywords with filtering, sorting, and pagination.
    // 1. Extract query params (isActive, sortBy, sortOrder, page, limit).
    // 2. Build a Firestore query based on the params.
    // 3. Call a service function to execute the query.
    // 4. Return the list of keywords.
    const db = getDb();
    const data = await db.collection(collectionName).get();
    const keywords = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(keywords);
  } catch (error) {
    next(error);
  }
};

export const getKeywordById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement logic to get a single keyword.
    const db = getDb();
    const docRef = db.collection(collectionName).doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ message: "Keyword not found" });
    }

    res.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    next(error);
  }
};

export const updateKeyword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement logic to update a keyword's name.
    const db = getDb();
    const docRef = db.collection(collectionName).doc(req.params.id);
    const updatedData = {
      ...req.body,
      updatedAt: admin.firestore.Timestamp.now(),
    };
    await docRef.update(updatedData);
    const updated = await docRef.get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    next(error);
  }
};

export const updateKeywordStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const db = getDb();
    const docRef = db.collection(collectionName).doc(req.params.id);
    await docRef.update({
      isActive: req.body.isActive,
      updatedAt: admin.firestore.Timestamp.now(),
    });

    const updated = await docRef.get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (error) {
    next(error);
  }
};

export const deleteKeyword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement logic to delete a keyword.
    const db = getDb();
    const deleteRecord = db.collection(collectionName).doc(req.params.id);
    await deleteRecord.delete();
    res.json({ message: "Successfully Deleted!" });
  } catch (error) {
    next(error);
  }
};
