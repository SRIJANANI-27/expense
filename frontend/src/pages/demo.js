
// import React from 'react';

// const ExpenseTable = ({ expenses, deleteExpens, setEditingExpense, setIsEditing }) => {
    
//     const handleEdit = (expense) => {
//         setEditingExpense(expense);
//         setIsEditing(true);
//     };

//     return (
//         <div className="overflow-x-auto mt-10">
//             <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                     <tr>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Title
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Description
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             reason
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Amount
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Date
//                         </th>
//                         <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                             Actions
//                         </th>
//                     </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                     {expenses.map((expense) => (
//                         <tr key={expense._id}>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                 {expense.title}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                 {expense.description}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                 {expense.reason}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {expense.amount}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                                 {new Date(expense.date).toLocaleDateString()}
//                             </td>
//                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                                 <button
//                                     onClick={() => handleEdit(expense)}
//                                     className="text-blue-600 hover:text-blue-900 mr-4"
//                                 >
//                                     Edit
//                                 </button>
//                                 <button
//                                     onClick={() => deleteExpens(expense._id)}
//                                     className="text-red-600 hover:text-red-900"
//                                 >
//                                     Delete
//                                 </button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         </div>
//     );
// };

// export default ExpenseTable;

<button
                    onClick={() => handleEdit(expense)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <img src={editIcon} alt="Edit" className="w-5 h-5 inline" /> Edit
                  </button>
                  {/* Delete button with icon */}
                  <button
                    onClick={() => deleteExpens(expense._id)}
                    className="ml-4 text-red-600 hover:text-red-900"
                  >
                    <img src={deleteIcon} alt="Delete" className="w-5 h-5 inline" /> Delete
                  </button>