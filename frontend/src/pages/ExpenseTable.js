import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import editIcon from "../assets/edit.png";
import deleteIcon from "../assets/deletes.png";
import deletes from "../assets/deletes.jpeg";
import down from "../assets/down.png";
import axios from "axios";
import { APIUrl, handleError, handleSuccess } from "../utils";

const ExpenseTable = ({
  expenses,
  deleteExpens,
  setEditingExpense,
  setIsEditing,
}) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [titleFilter, setTitleFilter] = useState("all");
  const [descriptionFilter, setDescriptionFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [monthFilter, setMonthFilter] = useState("");
  const rowsPerPage = 10;
  const navigate = useNavigate();

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setIsEditing(true);
  };

  const formatNumber = (num) => {
    return num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
  };

  const bulkDeleteTransactions = async () => {
    try {
      const result = await Swal.fire({
        html: `
          <div style="text-align: center;">
            <img src="${deletes}" alt="Delete Icon" style="width: 110px; height: 110px; display: block; margin: 0 auto;" />
            
          </div>
        `,
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete them!",
        customClass: {
            popup: 'custom-swal-width' // Apply the custom class here
          }
      });

      if (result.isConfirmed) {
        await Promise.all(
          selectedRows.map((id) => deleteExpens(id))
        );
        
        navigate(0);
      }
    } catch (err) {
      console.error("Error deleting transactions:", err);
      Swal.fire(
        "Error!",
        "An error occurred while deleting the transactions.",
        "error"
      );
    }
  };

  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        text: "No Selection!",
        icon: "warning",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }
    bulkDeleteTransactions();
  };

  const uniqueTitles = ["all", ...new Set(expenses.map((t) => t.title))];
  const uniqueDescriptions = [
    "all",
    ...new Set(expenses.map((t) => t.description)),
  ];
  const amountRanges = [
    "all",
    "Below Rs.100",
    "Rs.100 - Rs.500",
    "Rs.500 - Rs.1000",
    "Above Rs.1000",
  ];

  const filterByMonth = (data) => {
    if (!monthFilter) return data;
    const [year, month] = monthFilter.split("-");
    return data.filter((item) => {
      const itemDate = new Date(item.date);
      return (
        itemDate.getFullYear() === parseInt(year, 10) &&
        itemDate.getMonth() + 1 === parseInt(month, 10)
      );
    });
  };

  const handleRowClick = (id, e) => {
    e.stopPropagation();
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(id)
        ? prevSelectedRows.filter((rowId) => rowId !== id)
        : [...prevSelectedRows, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === expenses.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(expenses.map((expense) => expense._id));
    }
  };

  const filteredExpenses = filterByMonth(expenses).filter((expense) => {
    const amount = expense.amount;
    let amountMatch = false;
    switch (amountFilter) {
      case "all":
        amountMatch = true;
        break;
      case "Below Rs.100":
        amountMatch = amount < 100;
        break;
      case "Rs.100 - Rs.500":
        amountMatch = amount >= 100 && amount <= 500;
        break;
      case "Rs.500 - Rs.1000":
        amountMatch = amount > 500 && amount <= 1000;
        break;
      case "Above Rs.1000":
        amountMatch = amount > 1000;
        break;
      default:
        amountMatch = false;
    }

    return (
      (titleFilter === "all" || expense.title === titleFilter) &&
      (descriptionFilter === "all" ||
        expense.description === descriptionFilter) &&
      amountMatch
    );
  });

  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const totalPages = Math.ceil(sortedExpenses.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedExpenses = sortedExpenses.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  function formatDate(dateString) {
    const options = { year: "2-digit", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }

  return (
    <div className="mt-4 p-4">
      <div className="flex justify-between mb-4">
        <button
          onClick={handleDeleteSelected}
          className="p-2 bg-red-200 hover:bg-red-300 text-red-800 rounded-lg shadow-md"
        >
          Delete Selected
        </button>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={selectedRows.length === expenses.length}
            onChange={handleSelectAll}
            className="mr-2"
          />
          <span>Select All</span>
        </div>
      </div>

      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-100 border-b border-gray-200">
            <th className="px-4 py-2 text-center text-gray-600">S.No</th>
            <th className="relative px-4 py-2 text-center text-gray-600">
              Type
              <button
                onClick={() =>
                  setDropdownOpen(dropdownOpen === "type" ? null : "type")
                }
                className="ml-2 text-gray-600"
              >
                <img src={down} alt="arrow" className="w-3 h-3 inline" />
              </button>
              {dropdownOpen === "type" && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {uniqueTitles.map((title) => (
                    <button
                      key={title}
                      onClick={() => setTitleFilter(title)}
                      className="block w-full px-4 py-2 text-gray-700 text-left hover:bg-gray-100"
                    >
                      {title}
                    </button>
                  ))}
                </div>
              )}
            </th>
            <th className="relative px-4 py-2 text-center text-gray-600">
  Description
  <button
    onClick={() =>
      setDropdownOpen(
        dropdownOpen === "description" ? null : "description"
      )
    }
    className="ml-2 text-gray-600"
  >
    <img src={down} alt="arrow" className="w-3 h-3 inline" />
  </button>
  {dropdownOpen === "description" && (
    <div className="absolute right-0 mt-2 w-48 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg">
      {uniqueDescriptions.map((description) => (
        <button
          key={description}
          onClick={() => setDescriptionFilter(description)}
          className="block w-full px-4 py-2 text-gray-700 text-left hover:bg-gray-100"
        >
          {description}
        </button>
      ))}
    </div>
  )}
</th>

            <th className="relative px-4 py-2 text-center text-gray-600">
              Amount
              <button
                onClick={() =>
                  setDropdownOpen(dropdownOpen === "amount" ? null : "amount")
                }
                className="ml-2 text-gray-600"
              >
                <img src={down} alt="arrow" className="w-3 h-3 inline" />
              </button>
              {dropdownOpen === "amount" && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
                  {amountRanges.map((range) => (
                    <button
                      key={range}
                      onClick={() => setAmountFilter(range)}
                      className="block w-full px-4 py-2 text-gray-700 text-left hover:bg-gray-100"
                    >
                      {range}
                    </button>
                  ))}
                </div>
              )}
            </th>
            <th className="relative px-4 py-2 text-center text-gray-600">
              Date
              <div className="d-flex flex-column me-3 inline-block ml-4">
                <input
                  type="month"
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="p-1 border border-gray-300 rounded-md w-7"
                />
              </div>
            </th>
            <th className="px-4 py-2 text-center text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedExpenses.map((expense, index) => {
            const isSelected = selectedRows.includes(expense._id);
            const bgColor =
              expense.title === "Income"
                ? isSelected
                  ? "bg-blue-100 text-green-500"
                  : "bg-green-50"
                : isSelected
                ? "bg-blue-100 text-red-600"
                : "bg-red-50";
            const textColor =
              expense.title === "Income" ? "text-green-800" : "text-red-800";
            return (
              <tr
                key={expense._id}
                className={`border-b border-gray-200 ${bgColor}`}
                onClick={(e) => handleRowClick(expense._id, e)}
              >
                <td className="px-4 py-2 text-center text-gray-600">
                  {index + 1}
                </td>
                <td className={`px-4 py-2 text-center ${textColor}`}>
                  {expense.title}
                </td>
                <td className={`px-4 py-2 text-center ${textColor}`}>
                {expense.description}
                {expense.reason ? ` - ${expense.reason}` : ""}
                </td>
                <td className={`px-4 py-2 text-center ${textColor}`}>
                  {formatNumber(expense.amount)}
                </td>
                <td className={`px-4 py-2 text-center ${textColor}`}>
                  {formatDate(expense.date)}
                </td>
                <td className="px-4 py-2 text-center">
  <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-x-2 md:space-y-0">
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent row click
        handleEdit(expense);
      }}
      className="p-2 rounded-full hover:bg-blue-200 hover:border-blue-300  duration-150 ease-in-out focus:outline-none flex items-center justify-center"
      aria-label="Edit"
    >
      <img src={editIcon} alt="Edit" className="w-5 h-5 md:w-6 md:h-6" />
    </button>
    <button
      onClick={(e) => {
        e.stopPropagation(); // Prevent row click
        Swal.fire({
          title: "Are you sure?",

          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#dc3545",
          cancelButtonColor: "#6c757d",
          confirmButtonText: "Yes, delete it!",
          customClass: {
            popup: 'custom-swal-width' // Apply the custom class here
          }
        }).then((result) => {
          if (result.isConfirmed) {
            deleteExpens(expense._id);
          }
        });
      }}
      className="p-2 hover:rounded-full hover:bg-red-200  hover:border-red-300   duration-150 ease-in-out  flex items-center justify-center"
      aria-label="Delete"
    >
      <img src={deleteIcon} alt="Delete" className="w-5 h-5 md:w-6 md:h-6" />
    </button>
  </div>
</td>


              </tr>
            );
          })}
        </tbody>
      </table>

      <nav className="flex items-center mt-4 justify-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 me-3 border border-gray-400 bg-white text-gray-800 rounded-lg shadow-md disabled:opacity-50 transition-all duration-300 ease-in-out hover:bg-gray-100"
        >
          ⬅️ Previous
        </button>
        <span className="text-gray-600 me-3">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border border-gray-400 bg-white text-gray-800 rounded-lg shadow-md disabled:opacity-50 transition-all duration-300 ease-in-out hover:bg-gray-100"
        >
          Next ➡️
        </button>
      </nav>
    </div>
  );
};

export default ExpenseTable;
