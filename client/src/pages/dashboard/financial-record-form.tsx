import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useFinancialRecords } from "../../contexts/financial-record-context";

interface FinancialRecord {
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

const FinancialRecordForm = () => {
  const [description, setDescription] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const { addRecord } = useFinancialRecords();
  const { user } = useUser();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user?.id) {
      setError("User not authenticated. Please log in.");
      return;
    }

    if (parseFloat(amount) <= 0) {
      setError("Amount must be a positive number.");
      return;
    }

    const newRecord: FinancialRecord = {
      userId: user.id,
      date: new Date(),
      description,
      amount: parseFloat(amount),
      category,
      paymentMethod,
    };

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      await addRecord(newRecord);
      setSuccess("Record added successfully!");
      setDescription("");
      setAmount("");
      setCategory("");
      setPaymentMethod("");
    } catch (err) {
      setError("Failed to add the record. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Description:</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Amount:</label>
          <input
            type="number"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label>Category:</label>
          <select
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Rent">Rent</option>
            <option value="Income">Income</option>
            <option value="Utilities">Utilities</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-field">
          <label>Payment Method:</label>
          <select
            required
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select a Payment Method</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Record"}
        </button>
      </form>
    </div>
  );
};

export default FinancialRecordForm;
