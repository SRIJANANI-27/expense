const UserModel = require('../Models/User')

const addTransaction = async (req, res) => {
    const { _id } = req.user;
    console.log(_id, req.body)
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $push: { expenses: req.body } },
            { new: true } // For Returning the updated documents
        )
        res.status(200)
            .json({
                message: "Expense added successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

const getAllTransactions = async (req, res) => {
    const { _id } = req.user;

    try {
        if (!UserModel) {
            throw new Error('UserModel is not defined');
        }
        const userData = await UserModel.findById(_id).select('expenses');
        if (!userData) {
            return res.status(404).json({ message: 'User not found', success: false });
        }
        res.status(200).json({
            message: "Fetched Expenses successfully",
            success: true,
            data: userData.expenses
        });
    } catch (err) {
        console.error("Error fetching expenses:", err);
        res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message // Include the error message for more details
        });
    }
};




const deleteTransaction = async (req, res) => {
    const { _id } = req.user;
    const expenseId = req.params.expenseId;
    try {
        const userData = await UserModel.findByIdAndUpdate(
            _id,
            { $pull: { expenses: { _id: expenseId } } },
            { new: true } // For Returning the updated documents
        )
        res.status(200)
            .json({
                message: "Expense Deleted successfully",
                success: true,
                data: userData?.expenses
            })
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        })
    }
}

const editTransaction = async (req, res) => {
    const { _id } = req.user;
    const { expenseId } = req.params;
    const updatedExpense = req.body;

    try {
        // Find the user and update the specific expense
        const userData = await UserModel.findOneAndUpdate(
            { _id, 'expenses._id': expenseId },
            { $set: { 'expenses.$': updatedExpense } },
            { new: true } // For returning the updated document
        );

        if (!userData) {
            return res.status(404).json({
                message: "User or expense not found",
                success: false
            });
        }

        res.status(200)
            .json({
                message: "Expense updated successfully",
                success: true,
                data: userData.expenses
            });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err,
            success: false
        });
    }
};
module.exports = {
    addTransaction,
    getAllTransactions,
    deleteTransaction,
    editTransaction
};
