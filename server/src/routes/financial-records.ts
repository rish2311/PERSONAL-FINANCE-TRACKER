import express, { Request, Response } from "express";
import FinancialRecordModel from "../schema/financial-record";

interface FinancialRecord {
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

const router = express.Router();

// Get all records by User ID
router.get(
  "/getAllByUserID/:userId",
  async (req: Request<{ userId: string }>, res: Response) => {
    try {
      const { userId } = req.params;
      const records = await FinancialRecordModel.find({ userId });

      if (!records || records.length === 0) {
        return res.status(404).send("No records found for the user.");
      }

      res.status(200).json(records);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Create a new financial record
router.post(
  "/",
  async (req: Request<{}, {}, FinancialRecord>, res: Response) => {
    try {
      const newRecord = new FinancialRecordModel(req.body);
      const savedRecord = await newRecord.save();
      res.status(201).json(savedRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Update an existing financial record by ID
router.put(
  "/:id",
  async (req: Request<{ id: string }, {}, FinancialRecord>, res: Response) => {
    try {
      const { id } = req.params;
      const updatedRecord = await FinancialRecordModel.findByIdAndUpdate(
        id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!updatedRecord) {
        return res.status(404).send("Record not found.");
      }

      res.status(200).json(updatedRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

// Delete a financial record by ID
router.delete(
  "/:id",
  async (req: Request<{ id: string }>, res: Response) => {
    try {
      const { id } = req.params;
      const deletedRecord = await FinancialRecordModel.findByIdAndDelete(id);

      if (!deletedRecord) {
        return res.status(404).send("Record not found.");
      }

      res.status(200).json(deletedRecord);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    }
  }
);

export default router;
