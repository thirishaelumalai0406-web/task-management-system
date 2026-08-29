const generateToken = require('../utils/generateToken');
const { asyncHandler } = require('../middleware/errorMiddleware');
const User = require('../models/User');

// @desc   Authenticate user and return a JWT
// @route  POST /api/auth/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  res.json({
    success: true,
    token: generateToken(user._id, user.role),
    user: { id: user._id, name: user.name, email: user.email, role: user.role }
  });
});

// @desc   Get current authenticated user
// @route  GET /api/auth/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

module.exports = { loginUser, getMe };
