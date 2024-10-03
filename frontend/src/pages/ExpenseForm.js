import React, { useState, useEffect } from "react";
import { handleError } from "../utils";

function ExpenseForm({ addTransaction, editTransaction, editingExpense, setEditingExpense }) {
  const [expenseInfo, setExpenseInfo] = useState({
    description: "",
    title: "",
    amount: "",
    reason: "",
    date: "",
  });

  useEffect(() => {
    if (editingExpense) {
      setExpenseInfo({
        ...editingExpense,
        date: editingExpense.date ? new Date(editingExpense.date).toISOString().substring(0, 10) : "" // Format the date for the input field
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const formatAmount = (value) => {
    if (typeof value !== "string") {
      value = String(value);
    }
    const cleanValue = value.replace(/[^0-9.]/g, "");
    return cleanValue ? parseFloat(cleanValue).toLocaleString() : "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { description, title, amount, reason, date } = expenseInfo;
    if (!description || !amount || !title || !date) {
      handleError("Please fill out all fields");
      return;
    }
    if (editingExpense) {
      editTransaction(editingExpense._id, expenseInfo);
    } else {
      addTransaction(expenseInfo);
    }
    setExpenseInfo({
      description: "",
      title: "",
      amount: "",
      reason: "",
      date: "",
    });
    setEditingExpense(null); // Clear editing mode
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg mt-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
         
          <select
            onChange={handleChange}
            name="title"
            value={expenseInfo.title}
            className="mt-2 p-2 border border-gray-300 rounded-md"
          >
             <option value="">Select Type</option>
            <option value="Expense">Expense</option>
            <option value="Income">Income</option>
          </select>
        </div>

        <div className="input-group flex flex-col sm:flex-row gap-2">
          <select
            name="description"
            value={expenseInfo.description}
            onChange={handleChange}
            className="form-input w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 "
          >
            <option value="">Select Description</option>
            <option value="Salary">🤑 Salary</option>
            <option value="Food">🥪 Food</option>
            <option value="Rent">🏠 Rent</option>
            <option value="Medicine">💊 Healthcare</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Utilities">💡 Utilities</option>
            <option value="Transportation">🚗 Transportation</option>
            <option value="Education">📚 Education</option>
            <option value="Transportation">🚉 Transportation</option>
            <option value="other">✏️ Other (Specify)</option>
          </select>

          {expenseInfo.description && (
            <input
              type="text"
              name="reason"
              value={expenseInfo.reason || ""}
              onChange={handleChange}
              placeholder="Add details (optional)"
              className="form-input mt-3 sm:mt-0 sm:ml-2 w-full border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}
        </div>

        <div className="flex flex-col">
         
          <input
            onChange={handleChange}
            type="text"
            name="amount"
            placeholder="Enter the amount..."
            value={formatAmount(expenseInfo.amount)}
            className="mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex flex-col">
          
          <input
            onChange={handleChange}
            type="date"
            name="date"
            value={expenseInfo.date}
            className="mt-1 p-2 border border-gray-300 rounded-md"
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 rounded-md mt-4"
        >
          {editingExpense ? "Update Expense" : "Add Expense"}
        </button>
      </form>
    </div>
  );
}

export default ExpenseForm;
