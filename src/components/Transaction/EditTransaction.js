import React, { useState, useEffect } from "react";
import API from "../../utils/API";

export default function EditTransaction(props) {
  const [formState, setFormState] = useState({
    description: "",
    value: "",
    date: "",
    cleared: "",
  });

  const formSubmit = (e) => {
    e.preventDefault();
    let updates;
    API.update({ ...formState }, props.target, props.token)
      .then((res) => {
        props.setShowEdit(false);
        updates = props.transactions.map((item) => {
          if (item.id === Number(props.target)) {
            return {
              ...item,
              description: formState.description,
              value: formState.value,
              date: formState.date,
              cleared: formState.cleared,
            };
          }
          return item;
        });
      })
      .then(() => {
        props.setTransactions(updates);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    let updates;
    if (
      window.confirm(
        "Are you sure you want to delete this transaction? It cannot be undone!"
      )
    ) {
      API.delete(props.target, props.token)
        .then((res) => {
          props.setShowEdit(false);
          updates = props.transactions.filter((object) => {
            return object.id !== Number(props.target);
          });
          props.setTransactions(updates);
        })
        .catch((err) => console.log(err));
    }
  };

  useEffect(() => {
    API.getOne(props.target, props.token).then((res) => {
      const date = res.data.date.slice(0, 10);
      setFormState({
        description: res.data.description,
        value: res.data.value,
        date: date,
        cleared: res.data.cleared,
      });
    });
  }, [props.target, props.token]);
  return (
    <div>
      <form onSubmit={formSubmit}>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={formState.description}
            onChange={handleFormChange}
            placeholder="description"
          />
          <label className="form-label" htmlFor="description">
            Description
          </label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="number"
            className="form-control"
            id="value"
            name="value"
            value={formState.value}
            onChange={handleFormChange}
            placeholder="value"
          />
          <label className="form-label" htmlFor="value">
            Value
          </label>
        </div>
        <div className="form-floating mb-3">
          <input
            className="form-control"
            type="date"
            id="date"
            name="date"
            onChange={handleFormChange}
            value={formState.date}
          />
          <label className="form-label" htmlFor="date">
            Date
          </label>
        </div>
        <div className="d-flex">
          <button type="submit" className="mx-auto p-2">
            Submit
          </button>
          <button className="mx-auto p-2" onClick={handleDelete}>
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}
