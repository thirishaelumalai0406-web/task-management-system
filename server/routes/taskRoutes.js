const express = require('express');
const {
  createTask,
  getTasks,
  getTaskStats,
  getMyTasks,
  updateTaskStatus
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');
const { createTaskValidator, updateStatusValidator } = require('../validators/taskValidators');
const validate = require('../middleware/validateMiddleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

// Admin-only task management
router.post('/', protect, authorizeRoles(ROLES.ADMIN), createTaskValidator, validate, createTask);
router.get('/', protect, authorizeRoles(ROLES.ADMIN), getTasks);
router.get('/stats', protect, authorizeRoles(ROLES.ADMIN), getTaskStats);

// Employee-only routes
router.get('/my-tasks', protect, authorizeRoles(ROLES.EMPLOYEE), getMyTasks);
router.patch('/:id/status', protect, authorizeRoles(ROLES.EMPLOYEE), updateStatusValidator, validate, updateTaskStatus);

module.exports = router;
