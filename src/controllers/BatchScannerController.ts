import { Request, Response, NextFunction } from "express";
import AdmZip from "adm-zip";
import PdfParse from "pdf-parse";
import { findEmail, findName } from "../lib/findNameEmail";
import { matchedKeywords } from "../lib/matchedKeywords";
import { storeBatchResult } from "../lib/storeBatchResults";

export const batchScanner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    // Load and unzip the file
    const zipBuffer = req.file.buffer;
    const zip = new AdmZip(zipBuffer);
    const zipEntries = zip.getEntries();

    const cvResults = [];

    // Checks for pdf files and extract their text and store results in an empty array
    for (const entry of zipEntries) {
      if (entry.entryName.endsWith(".pdf")) {
        const pdfBuffer = entry.getData();
        const data = await PdfParse(pdfBuffer);
        cvResults.push({
          text: data.text,
        });
      }
    }

    // Mapping to get necessary information from extracted text
    const results = await Promise.all(
      cvResults.map(async (batch) => {
        const data = batch.text;
        const email = findEmail(data);
        const name = findName(data);
        const matched = await matchedKeywords(data);
        const result = {
          email: email,
          extractedName: name,
          matchedKeywords: matched,
          fullText: data,
        };

        return await storeBatchResult(result);
      })
    );

    //Sending back batch result
    res.json(results);
  } catch (err) {
    next(err);
  }
};
