import { useMemo, useState } from "react";
import { FinancialRecord, useFinancialRecords } from "../../contexts/financial-record-context";
import { useTable, Column, CellProps } from "react-table";

// EditableCellProps interface for the editable cell component
interface EditableCellProps extends CellProps<FinancialRecord> {
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

// EditableCell Component
const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const handleBlur = () => {
    setIsEditing(false);
    if (value !== initialValue) {
      updateRecord(row.index, column.id, value);
    }
  };

  return (
    <div onClick={() => editable && setIsEditing(true)}>
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          autoFocus
          style={{ width: "100%" }}
        />
      ) : typeof value === "string" ? (
        value
      ) : (
        value?.toString()
      )}
    </div>
  );
};

// FinancialRecordList Component
export const FinancialRecordList: React.FC = () => {
  const { records } = useFinancialRecords();

  const columns: Array<Column<FinancialRecord>> = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={() => null} editable={true} />
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={() => null} editable={true} />
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={() => null} editable={true} />
        ),
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={() => null} editable={true} />
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={() => null} editable={false} />
        ),
      },
      {
        Header: "Delete",
        id: "delete",
        Cell: ({ row }) => (
          <button onClick={() => null} className="button">
            {" "} 
          Delete{" "}
          </button>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: records,
  });

  return (
    <div className="table-container">
      <table {...getTableProps()} className="table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()} key={column.id}>
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()} key={cell.column.id}>
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <p>Record List</p>
    </div>
  );
};

export default FinancialRecordList;
