import React from "react";
import { useNavigate } from "react-router-dom";
import { Loader } from "./Loading";

export const Table = ({
  coloums = [],
  data = [],
  keyField = undefined,
  noDataMessage = "No Exists",
  path = "",
  className = {
    table: "",
    thead: "",
    tbody: "",
    tr: "",
    th: "",
    td: "",
  },
  loading = true,
}) => {
  const naviagte = useNavigate();

  function handleRowClick(row) {
    console.log('row', row)
    console.log('path', path)

    if (path) {
      if (path == `/employees` || path == `/projects`)
        naviagte(`${path}/${row._id}/workTimeEntries`);
    } else {
      naviagte(`${path}/${row._id}`);
    }
  }

  return (
    <table className={"table-auto w-full text-center " + className.table}>
      <thead className={className.thead}>
        <tr>
          {coloums.map((col, index) => (
            <th key={col.key || index} className={className.th}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className={" " + className.tbody}>
        {loading ? (
          <tr>
            <td colSpan={coloums.length}>
              <Loader />
            </td>
          </tr>
        ) : (
          <>
            {data.length && !loading ? (
              data.map((item, rowIndex) => (
                <tr
                  key={keyField ? item[keyField] : rowIndex}
                  className={className.tr}
                  onClick={() => handleRowClick(item)}
                >
                  {coloums.map((col, cellIndex) => (
                    <td
                      key={col.key || cellIndex}
                      className={"truncate " + className.td}
                    >
                      {col.render ? col.render(item, rowIndex) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={coloums.length} className="py-10 text-[#666666]">
                  {noDataMessage}
                </td>
              </tr>
            )}
          </>
        )}
      </tbody>
    </table>
  );
};
