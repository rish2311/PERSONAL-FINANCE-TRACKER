import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useState, useEffect } from "react";

export interface FinancialRecord {
  id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => Promise<void>;
}

const FinancialRecordsContext = createContext<
  FinancialRecordsContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const { user } = useUser();

  const fetchRecords = async() => {
    if (!user) return;
    const response = await fetch(
      `http://localhost:3001/financial-records/getAllByUserID/${user?.id ?? ""}`
    );

    if (response.ok){
      const records = await response.json();
      setRecords(records);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const addRecord = async (record: FinancialRecord) => {
    try {
      const response = await fetch("http://localhost:3001/financial-records", {
        method: "POST",
        body: JSON.stringify(record),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const newRecord = await response.json();
        newRecord.date = new Date(newRecord.date);
        setRecords((prev) => [...prev, newRecord]);
      } else {
        console.error("Failed to add record:", response.statusText);
      }
    } catch (err) {
      console.error("Error while adding record:", err);
    }
  };

  return (
    <FinancialRecordsContext.Provider value={{ records, addRecord }}>
      {children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext(FinancialRecordsContext);

  if (!context) {
    throw new Error(
      "useFinancialRecords must be used within a FinancialRecordsProvider"
    );
  }

  return context;
};
