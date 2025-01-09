import { Schema, model, Document } from "mongoose";

// Define the interface for a Financial Record
interface FinancialRecord extends Document {
  userId: string; // User associated with this financial record
  date: Date; // Date of the transaction
  description: string; // Description of the transaction (e.g., "Dinner with friends")
  amount: number; // Amount involved in the transaction
  category: string; // Category of the expense (e.g., "Food", "Entertainment")
  paymentMethod: string; // Method of payment (e.g., "Credit Card", "Cash")
}

// Define the Mongoose Schema for the FinancialRecord model
const financialRecordSchema = new Schema<FinancialRecord>({
  userId: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String }, // Could be optional if required: false
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  paymentMethod: { type: String, required: true },
});

// Create the Mongoose Model for the FinancialRecord schema
const FinancialRecordModel = model<FinancialRecord>(
  "FinancialRecord", // The name of the collection in MongoDB
  financialRecordSchema, // The schema to use
);

export default FinancialRecordModel;