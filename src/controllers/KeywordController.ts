import { Request, Response, NextFunction } from "express";
import { getDb } from "../configs/firebase"; // function that interacts with firebase
import { Keyword } from "../models/keywords-scanner"; //Imports the keyword model
import * as admin from "firebase-admin";

const collectionName = "keywords"; // Sets Collection in Firebase Database

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

    //Invokes and initialized function that interact with FireStore
    const db = getDb();

    //Storing keyword values from client request
    const data: Keyword = req.body;

    // Ensures that name field is filled out
    if (!data.name) {
      return res.status(404).json({ message: "Error! name is required!" });
    }

    //Sets each field value from client request
    const keyword: Keyword = {
      name: data.name.toLowerCase(),
      isActive: data.isActive ?? true, // Sets isActive field default value to true
      createdAt: admin.firestore.Timestamp.now(),
      updatedAt: admin.firestore.Timestamp.now(),
    };

    //Saves the record to Firebase Database
    const keywordRef = db.collection(collectionName).doc();
    await keywordRef.set(keyword);

    //Response upon successful keyword creation
    res.status(201).json({
      id: keywordRef.id,
      name: keyword.name,
      isActive: keyword.isActive,
      createdAt: keyword.createdAt?.toDate().toISOString(),
      updatedAt: keyword.updatedAt?.toDate().toISOString(),
    });
  } catch (error) {
    //When error occurs, passes to error handler
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

    //Invokes and initialized function that interact with FireStore
    const db = getDb();

    //Initializes the request query default values
    const {
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    //Sets the all possible sorting query
    const allowedSortFields = ["name", "createdAt"];
    const sortField = allowedSortFields.includes(sortBy as string)
      ? (sortBy as string)
      : "createdAt";

    //Handles pagination
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    // Initializes firebase query in the keywords collection
    let query: FirebaseFirestore.Query = db.collection(collectionName);

    // Apply isActive filter if client provided in query params
    if (isActive !== undefined) {
      const isActiveBool = isActive === "true";
      query = query.where("isActive", "==", isActiveBool);
    }

    //Executes the queries including the filter, order, pagination
    query = query
      .orderBy(sortField, sortOrder as FirebaseFirestore.OrderByDirection)
      .limit(limitNum)
      .offset(offset);

    // Gets and stores the data from firebase and formats it accordingly
    const datas = await query.get();
    const keywords = datas.docs.map((data) => {
      const record = data.data();
      return {
        id: data.id,
        name: record?.name,
        isActive: record?.isActive,
        createdAt: record.createdAt?.toDate().toISOString(),
        updatedAt: record.updatedAt?.toDate().toISOString(),
      };
    });

    //Sends the response to client
    res.json(keywords);
  } catch (error) {
    //When error occurs, passes to error handler
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

    //Invokes and initialized function that interact with FireStore
    const db = getDb();

    //Initialize document reference and fetch the appropriate data from firestore
    const keywordRef = db.collection(collectionName).doc(req.params.id);
    const keywordSnap = await keywordRef.get();

    //Handles error request if the keyword id is not found
    if (!keywordSnap.exists) {
      return res.status(404).json({ message: "Keyword not found" });
    }

    // Formats and sends the response json to client
    const keyword = keywordSnap.data();
    res.json({
      id: keywordSnap.id,
      name: keyword?.name,
      isActive: keyword?.isActive,
      createdAt: keyword?.createdAt.toDate().toISOString(),
      updatedAt: keyword?.updatedAt.toDate().toISOString(),
    });
  } catch (error) {
    //When error occurs, passes to error handler
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

    //Invokes and initialized function that interact with FireStore
    const db = getDb();

    //Stores the values that the client wants to update
    const updatedData = {
      ...req.body,
      updatedAt: admin.firestore.Timestamp.now(),
    };

    //Initialize document reference and fetch the appropriate data from firestore
    const keywordRef = db.collection(collectionName).doc(req.params.id);
    await keywordRef.update(updatedData);
    const updatedKeyword = await keywordRef.get();

    // Formats and sends the response json to client
    const keyword = updatedKeyword.data();
    res.json({
      id: updatedKeyword.id,
      name: keyword?.name,
      isActive: keyword?.isActive,
      createdAt: keyword?.createdAt.toDate().toISOString(),
      updatedAt: keyword?.updatedAt.toDate().toISOString(),
    });
  } catch (error) {
    //When error occurs, passes to error handler
    next(error);
  }
};

export const updateKeywordStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // TODO: Implement logic to update a keyword's isActive status.

    //Invokes and initialized function that interact with FireStore
    const db = getDb();

    //Initialize keyword reference and
    const keywordRef = db.collection(collectionName).doc(req.params.id);

    // Limits request to only isActive field
    const allowedField = ["isActive"];
    const key = Object.keys(req.body);

    if (key.length !== 1 || !allowedField.includes(key[0])) {
      return res.status(400).json({
        message: "Error! Exclusive for isActive field",
      });
    }

    //Executes record patch
    await keywordRef.update({
      isActive: req.body.isActive,
      updatedAt: admin.firestore.Timestamp.now(),
    });

    // fetch the appropriate data from firestore
    const updatedKeyword = await keywordRef.get();

    // Formats and sends the response json to client
    const keyword = updatedKeyword.data();
    res.json({
      id: updatedKeyword.id,
      name: keyword?.name,
      isActive: keyword?.isActive,
      createdAt: keyword?.createdAt.toDate().toISOString(),
      updatedAt: keyword?.updatedAt.toDate().toISOString(),
    });
  } catch (error) {
    //If error occurs pass to error handler
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

    //Invokes and initialized function that interact with FireStore
    const db = getDb();

    // Initializes keyword reference id to be deleted
    const keywordRef = db.collection(collectionName).doc(req.params.id);

    // Deletes the record from firebase
    await keywordRef.delete();

    // Returns success message if keyword is successfully deleted
    res.json({ message: "Keyword deleted." });
  } catch (error) {
    //If error occurs pass to error handler
    next(error);
  }
};
