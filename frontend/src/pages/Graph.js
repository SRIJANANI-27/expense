import React from 'react';
import { Doughnut } from 'react-chartjs-2'; // Use Doughnut instead of Pie
import { ArcElement, Chart, Tooltip, Legend } from 'chart.js';
import Labels from '../pages/Label'; // Make sure this path is correct

// Register the necessary Chart.js elements
Chart.register(ArcElement, Tooltip, Legend);

function Graph({ expenses }) {
  // Calculate totals for income and expenses
  const totals = expenses.reduce(
    (acc, transaction) => {
      if (transaction.title === 'Income') {
        acc.income += transaction.amount;
      } else if (transaction.title === 'Expense') {
        acc.expense += transaction.amount;
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  // Format number for display
  const formatNumber = (num) => {
    return num.toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  // Calculate net total
  const netTotal = totals.income - totals.expense;

  // Data for Doughnut chart
  const data = {
    labels: ['Income', 'Expenses', 'Net Total'],
    datasets: [
      {
        data: [totals.income, totals.expense, netTotal],
        backgroundColor: [
          'rgb(75, 192, 162)',  // Income color
          'rgb(255, 99, 132)',  // Expense color
          'rgb(54, 162, 235)',  // Net total color
        ],
        
        hoverOffset: 5,
        borderRadius: 30,
        spacing: 10,
      },
    ],
  };

  // Chart options
  const options = {
    cutout: 68, // thickness for Doughnut chart
    plugins: {
      legend: {
        display: true, // Show legend with labels
        position: 'bottom', // Legend position
      },
    },
  };

  return (
    <div className="flex justify-center max-w-xs mx-auto">
      <div className="item">
        <div className="chart relative w-full h-60">
          <Doughnut data={data} options={options} /> {/* Render Doughnut chart */}
          <h4 className="mb-4 font-bold title">
            Net Total
            <span className="block text-3xl text-emerald-400">
              Rs. {formatNumber(netTotal)}
            </span>
          </h4>
        </div>
        <div className="flex flex-col py-10 gap-4">
          <Labels
            data={[
              { type: 'Income', color: 'rgb(75, 192, 162)', percent: formatNumber(totals.income) },
              { type: 'Expense', color: 'rgb(255, 99, 132)', percent: formatNumber(totals.expense) },
              { type: 'Net Total', color: 'rgb(54, 162, 235)', percent: formatNumber(netTotal) },
            ]}
          />
        </div>
      </div>
    </div>
  );
}

export default Graph;
