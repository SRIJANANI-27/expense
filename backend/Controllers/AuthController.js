const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User'); // Adjust the path as needed



const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409)
                .json({ message: 'User is already exist, you can login', success: false });
        }
        const userModel = new UserModel({ name, email, password });
        userModel.password = await bcrypt.hash(password, 10);
        await userModel.save();
        res.status(201)
            .json({
                message: "Signup successfully",
                success: true
            })
    } catch (err) {
        console.error("Signup Error:", err);
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });
        const errorMsg = 'password is wrong';
        if (!user) {
            return res.status(404)
                .json({ message: "No User found", success: false });
        }
        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403)
                .json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        res.status(200)
            .json({
                message: "Login Success",
                success: true,
                jwtToken,
                email,
                name: user.name
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server errror",
                success: false
            })
    }
}

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    // Check if email and new password are provided
    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required.' });
    }

    try {
        // Log email for debugging purposes
        console.log('Resetting password for email:', email);

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'No user registered with this email.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password
        user.password = hashedPassword;
        await user.save();

        // Return success message
        return res.status(200).json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        // Log the error for better debugging
        console.error("Reset Password Error:", error);

        // Return error message
        return res.status(500).json({ success: false, message: 'An error occurred while resetting the password.' });
    }
};



module.exports = {
    signup,
    login,
    resetPassword
}