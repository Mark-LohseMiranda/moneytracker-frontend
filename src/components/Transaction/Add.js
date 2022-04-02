import React, { useState } from "react";
import API from "../../utils/API";

export default function Add(props) {
  const [deposit, setDeposit] = useState(false);
  const [withdrawal, setWithdrawal] = useState(false);
  const [addFormState, setAddFormState] = useState({
    description: "",
    value: "",
    date: "",
    cleared: false,
  });
  const handleAddFormChange = (e) => {
    const { value, id, checked } = e.target;

    if (id !== "cleared") {
      setAddFormState({
        ...addFormState,
        [id]: value,
      });
    } else {
      setAddFormState({
        ...addFormState,
        [id]: checked,
      });
    }
  };
  const handleAddFormSubmit = (e) => {
    e.preventDefault();
    if (withdrawal) {
      setAddFormState({
        ...addFormState,
        value: (addFormState.value *= -1),
      });
      setWithdrawal(false);
    } else {
      setDeposit(false);
    }
    API.addTransaction(addFormState, props.token)
      .then((res) => {
        const tempArray = [...props.transactions];
        tempArray.push(res.data);
        props.setTransactions(tempArray);
        setAddFormState({
          description: "",
          value: "",
          date: "",
          cleared: false,
        });
      })
      .catch((err) => {
        console.log("catch");
        console.log(err);
      });
  };
  return (
    <div>
      <button
        onClick={() => {
          setDeposit(false);
          setWithdrawal(!withdrawal);
        }}
      >
        Withdrawal
      </button>
      <button
        onClick={() => {
          setWithdrawal(false);
          setDeposit(!deposit);
        }}
      >
        Deposit
      </button>
      {withdrawal || deposit ? (
        <form onSubmit={handleAddFormSubmit}>
          <div className="row">
            <div className="col-sm-12 col-md-3 form-floating">
              <input
                type="text"
                id="description"
                className="form-control"
                onChange={handleAddFormChange}
                placeholder="Description"
                value={addFormState.description}
              />
              <label className="form-label" htmlFor="description">
                Description
              </label>
            </div>
            <div className="col-sm-12 col-md-3 form-floating">
              <input
                type="number"
                id="value"
                className="form-control"
                onChange={handleAddFormChange}
                min="0"
                step=".01"
                placeholder="Value"
                value={addFormState.value}
              />
              <label className="form-label" htmlFor="value">
                Value
              </label>
            </div>
            <div className="col-sm-12 col-md-3 form-floating">
              <input
                type="date"
                id="date"
                className="form-control"
                onChange={handleAddFormChange}
                placeholder="Date"
                value={addFormState.date}
              />
              <label className="form-label" htmlFor="date">
                Date
              </label>
            </div>
            <div className="col-sm-12 col-md-3">
              <div className="row">
                <div className="col">
                  <label className="form-check-label" htmlFor="cleared">
                    Cleared
                  </label>
                  <br />
                  <input
                    type="checkbox"
                    id="cleared"
                    className="form-check-input"
                    onChange={handleAddFormChange}
                    checked={addFormState.cleared}
                  />
                </div>
                <div className="col">
                  <button type="submit">Add Transaction</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      ) : null}
    </div>
  );
}
