import React, { useState, useMemo } from "react";
import { format, parseISO } from "date-fns";
import API from "../../utils/API";
import "./Display.css";

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const TransactionTable = (props) => {
  const formatDate = (date) => {
    return format(parseISO(date.slice(0, 10)), "MMM do, yyyy");
  };

  const cleared = (e) => {
    let updateTrans = [...props.transactions];
    let update = [];
    for (let i = 0; i < updateTrans.length; i++) {
      if (updateTrans[i].id == e.target.id) {
        updateTrans[i].cleared = !updateTrans[i].cleared;
        API.cleared(
          { cleared: updateTrans[i].cleared },
          e.target.id,
          props.token
        ).catch((err) => {
          console.log(err);
        });
      }
      update.push(updateTrans[i]);
    }
    props.setTransactions(update);
  };

  const { items, requestSort, sortConfig } = useSortableData(
    props.transactions
  );
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <table className="table">
      <thead>
        <tr>
          <th>
            <button
              type="button"
              onClick={() => requestSort("description")}
              className={getClassNamesFor("description")}
            >
              Description
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort("value")}
              className={getClassNamesFor("value")}
            >
              Value
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort("date")}
              className={getClassNamesFor("date")}
            >
              Date
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort("cleared")}
              className={getClassNamesFor("cleared")}
            >
              Cleared
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {items?.map((item) => {
          return (
            <tr key={item.id}>
              <td>{item.description}</td>
              {item.value < 0 ? (
                <td className="text-danger">{item.value}</td>
              ) : (
                <td>{item.value}</td>
              )}
              <td>{formatDate(item.date)}</td>
              <td>
                <input
                  id={item.id}
                  type="checkbox"
                  className="form-check-input"
                  checked={item.cleared}
                  onClick={cleared}
                  readOnly
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default function Display({ setTransactions, transactions, token }) {
  return (
    <div>
      {transactions ? (
        <TransactionTable
          setTransactions={setTransactions}
          transactions={transactions}
          token={token}
        />
      ) : null}
    </div>
  );
}
