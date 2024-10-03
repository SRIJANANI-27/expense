import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { APIUrl, handleError, handleSuccess } from "../utils"; // Import handleError and handleSuccess
import { ToastContainer } from "react-toastify";
import ExpenseTable from "./ExpenseTable";
import ExpenseForm from "./ExpenseForm";
import { Link } from "react-router-dom";
import Graph from "../pages/Graph";

function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [incomeAmt, setIncomeAmt] = useState(0);
  const [expenseAmt, setExpenseAmt] = useState(0);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem("loggedInUser"));
  }, []);

  const handleLogout = (e) => {
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    handleSuccess("Logout successfully");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  useEffect(() => {
    const amounts = expenses.map((item) => item.amount);
    const income = amounts
      .filter((item) => item > 0)
      .reduce((acc, item) => acc + item, 0);
    const exp =
      amounts.filter((item) => item < 0).reduce((acc, item) => acc + item, 0) *
      -1;
    setIncomeAmt(income);
    setExpenseAmt(exp);
  }, [expenses]);

  const deleteExpens = async (id) => {
    try {
      const url = `${APIUrl}/expenses/${id}`;
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
        method: "DELETE",
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const result = await response.json();

      console.log("--result", result.data);
      setExpenses(result.data);
      handleSuccess("Deleted successfully ❌");
    } catch (err) {
      handleError("An error occurred while deleting expenses.");
    }
  };

  const fetchExpenses = async () => {
    try {
      const url = `${APIUrl}/expenses`;
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const result = await response.json();
      console.log("--results", result.data);
      setExpenses(result.data);
      // handleSuccess('Expenses fetched successfully',2000);
    } catch (err) {
      handleError("An error occurred while fetching expenses.");
    }
  };

  const addTransaction = async (data) => {
    try {
      const url = `${APIUrl}/expenses`;
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const result = await response.json();
      console.log("--result", result.data);
      setExpenses(result.data);
      handleSuccess("Added successfully 👍");
    } catch (err) {
      handleError("An error occurred while adding the transaction.");
    }
  };

  const editTransaction = async (id, updatedData) => {
    try {
      const url = `${APIUrl}/expenses/${id}`;
      const headers = {
        headers: {
          Authorization: localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify(updatedData),
      };
      const response = await fetch(url, headers);
      if (response.status === 403) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }
      const result = await response.json();
      console.log("--result", result.data);
      setExpenses(result.data);
      setIsEditing(false);
      setEditingExpense(null);
      handleSuccess("Transaction updated successfully");
    } catch (err) {
      handleError("An error occurred while editing the transaction.");
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div>
      <nav className="bg-slate-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-semibold">Balance Buddy ⚖️</h1>
        </div>
        <div className="space-x-4 flex items-center">
          {loggedInUser ? (
            <>
              <span className="font-semibold capitalize">
                Welcome, {loggedInUser}
              </span>
              <button
                onClick={handleLogout}
                className="bg-blue-500 px-3 py-1 rounded text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="grid md:grid-cols-2 gap-4 mt-10">
        <div className="col-span-1">
          <Graph expenses={expenses} />
        </div>
        <div className="col-span-1">
          <ExpenseForm
            addTransaction={addTransaction}
            editTransaction={editTransaction}
            editingExpense={editingExpense}
            setEditingExpense={setEditingExpense}
          />
        </div>
      </div>

      <ExpenseTable
        expenses={expenses}
        deleteExpens={deleteExpens}
        setEditingExpense={setEditingExpense}
        setIsEditing={setIsEditing}
      />
      <ToastContainer />

      <footer className="bg-gray-700 text-white py-2 text-center mt-5 w-full">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Balance Buddy Inc. All rights
          reserved.
        </p>
        <p className="text-xs">Designed by <span className="font-semibold">Srijanani</span></p>
      </footer>
    </div>
  );
}

export default Home;
