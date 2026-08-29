const express = require('express');
const { getEmployees } = require('../controllers/employeeController');
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.get('/', protect, authorizeRoles(ROLES.ADMIN), getEmployees);

module.exports = router;
