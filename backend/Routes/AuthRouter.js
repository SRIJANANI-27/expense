const { signup, login, resetPassword } = require('../Controllers/AuthController');
// const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');

const router = require('express').Router();

router.post('/login',  login);
router.post('/signup',  signup);
router.post('/reset',resetPassword);
module.exports = router;