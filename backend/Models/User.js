const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    expenses: [{
        description: { type: String },
        title: { type: String, enum: ['Income', 'Expense'] },
        amount: { type: Number },
        reason: { type: String },
        date: { type: Date }
    }]
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
