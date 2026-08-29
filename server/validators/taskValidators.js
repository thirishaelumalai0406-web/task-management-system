const { body } = require('express-validator');
const { PRIORITY, TASK_STATUS } = require('../utils/constants');

const createTaskValidator = [
  body('title').notEmpty().withMessage('Title is required').isLength({ max: 150 }).withMessage('Title must be at most 150 characters'),
  body('description').notEmpty().withMessage('Description is required').isLength({ max: 2000 }).withMessage('Description must be at most 2000 characters'),
  body('assignedTo').notEmpty().withMessage('Assigned employee is required').isMongoId().withMessage('Invalid employee id'),
  body('priority')
    .optional()
    .isIn([PRIORITY.HIGH, PRIORITY.MEDIUM, PRIORITY.LOW])
    .withMessage('Priority must be High, Medium or Low')
];

const updateStatusValidator = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn([TASK_STATUS.NOT_STARTED, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED])
    .withMessage('Status must be Not Started, In Progress or Completed')
];

module.exports = { createTaskValidator, updateStatusValidator };
