const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { ROLES } = require('../utils/constants');

// @desc   Get all employees (searchable by name/email)
// @route  GET /api/employees
// @access Private (admin)
const getEmployees = asyncHandler(async (req, res) => {
  const { search } = req.query;

  const filter = { role: ROLES.EMPLOYEE };
  if (search && search.trim()) {
    const q = search.trim();
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ];
  }

  const employees = await User.find(filter).select('name email').sort({ name: 1 });

  res.json({
    success: true,
    data: employees.map((e) => ({ _id: e._id, name: e.name, email: e.email }))
  });
});

module.exports = { getEmployees };
