const express = require('express');
const { loginUser, getMe } = require('../controllers/authController');
const { loginValidator } = require('../validators/authValidators');
const validate = require('../middleware/validateMiddleware');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginValidator, validate, loginUser);
router.get('/me', protect, getMe);

module.exports = router;
