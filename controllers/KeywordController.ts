import { Request, Response, NextFunction } from 'express';

// THIS IS A STUB FILE. The applicant needs to implement the logic.

export const createKeyword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Implement logic to create a keyword.
        // 1. Validate request body (e.g., ensure 'name' is present).
        // 2. Call a service function to interact with Firestore.
        // 3. Return the newly created keyword with a 201 status code.
        res.status(501).json({ message: 'Not Implemented' });
    } catch (error) {
        next(error);
    }
};

export const getKeywords = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Implement logic to get all keywords with filtering, sorting, and pagination.
        // 1. Extract query params (isActive, sortBy, sortOrder, page, limit).
        // 2. Build a Firestore query based on the params.
        // 3. Call a service function to execute the query.
        // 4. Return the list of keywords.
        res.status(501).json({ message: 'Not Implemented' });
    } catch (error) {
        next(error);
    }
};

export const getKeywordById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Implement logic to get a single keyword.
        res.status(501).json({ message: 'Not Implemented' });
    } catch (error) {
        next(error);
    }
};

export const updateKeyword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Implement logic to update a keyword's name.
        res.status(501).json({ message: 'Not Implemented' });
    } catch (error) {
        next(error);
    }
};

export const updateKeywordStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Implement logic to update a keyword's isActive status.
        res.status(501).json({ message: 'Not Implemented' });
    } catch (error) {
        next(error);
    }
};

export const deleteKeyword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // TODO: Implement logic to delete a keyword.
        res.status(501).json({ message: 'Not Implemented' });
    } catch (error) {
        next(error);
    }
};
