const Task = require('../models/Task');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorMiddleware');
const { ROLES, TASK_STATUS } = require('../utils/constants');
const sendEmail = require('../utils/sendEmail');
const { taskAssignedTemplate, statusUpdatedTemplate } = require('../utils/emailTemplates');

// Build a reusable query filter from common search/status/priority params
const buildTaskFilter = (req, extra = {}) => {
  const { search, status, priority } = req.query;
  const filter = { ...extra };

  if (search && search.trim()) {
    filter.$or = [{ title: { $regex: search.trim(), $options: 'i' } }];
  }
  if (status) {
    filter.status = status;
  }
  if (priority) {
    filter.priority = priority;
  }
  return filter;
};

// @desc   Create and assign a task to an employee
// @route  POST /api/tasks
// @access Private (admin)
const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, priority } = req.body;

  const employee = await User.findOne({ _id: assignedTo, role: ROLES.EMPLOYEE });
  if (!employee) {
    return res.status(400).json({ success: false, message: 'Assigned employee not found' });
  }

  const task = await Task.create({
    title,
    description,
    assignedTo,
    assignedBy: req.user.id,
    priority: priority || 'Medium'
  });

  // Non-blocking email notification to the assigned employee
  sendEmail(
    employee.email,
    `New task assigned: ${task.title}`,
    taskAssignedTemplate(employee.name, task.title, task.priority, task.description)
  );

  res.status(201).json({
    success: true,
    data: task,
    message: 'Task assigned and email sent'
  });
});

// @desc   Get all tasks with pagination, search, filters
// @route  GET /api/tasks
// @access Private (admin) — also optionally search by employee name
const getTasks = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const filter = buildTaskFilter(req);

  // Allow searching by employee name too for the admin view
  if (search && search.trim()) {
    const employees = await User.find({
      role: ROLES.EMPLOYEE,
      $or: [{ name: { $regex: search.trim(), $options: 'i' } }]
    }).select('_id');

    const employeeIds = employees.map((e) => e._id.toString());
    filter.$or.push({ assignedTo: { $in: employeeIds } });
  }

  const skip = (page - 1) * limit;
  const totalItems = await Task.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const tasks = await Task.find(filter)
    .populate({ path: 'assignedTo', select: 'name email' })
    .populate({ path: 'assignedBy', select: 'name email' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    data: tasks,
    pagination: { currentPage: page, totalPages, totalItems, limit }
  });
});

// @desc   Get task status statistics
// @route  GET /api/tasks/stats
// @access Private (admin)
const getTaskStats = asyncHandler(async (req, res) => {
  const [notStarted, inProgress, completed, total] = await Promise.all([
    Task.countDocuments({ status: TASK_STATUS.NOT_STARTED }),
    Task.countDocuments({ status: TASK_STATUS.IN_PROGRESS }),
    Task.countDocuments({ status: TASK_STATUS.COMPLETED }),
    Task.countDocuments({})
  ]);

  res.json({
    success: true,
    data: { notStarted, inProgress, completed, total }
  });
});

// @desc   Get tasks assigned to the logged-in employee
// @route  GET /api/tasks/my-tasks
// @access Private (employee)
const getMyTasks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const filter = buildTaskFilter(req, { assignedTo: req.user.id });
  const skip = (page - 1) * limit;
  const totalItems = await Task.countDocuments(filter);
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const tasks = await Task.find(filter)
    .populate({ path: 'assignedBy', select: 'name email' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.json({
    success: true,
    data: tasks,
    pagination: { currentPage: page, totalPages, totalItems, limit }
  });
});

// @desc   Update a task's status (employee must own the task)
// @route  PATCH /api/tasks/:id/status
// @access Private (employee)
const updateTaskStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ success: false, message: 'Task not found' });
  }

  // Ownership check
  if (task.assignedTo.toString() !== req.user.id) {
    return res.status(403).json({ success: false, message: 'You can only update your own tasks' });
  }

  const oldStatus = task.status;
  if (oldStatus === status) {
    return res.json({ success: true, data: task, message: 'No status change' });
  }

  task.status = status;
  await task.save();

  // Notify the admin(s) about the status update
  const employee = await User.findById(req.user.id).select('name email').lean();
  const admins = await User.find({ role: ROLES.ADMIN }).select('email name').lean();

  admins.forEach((admin) => {
    sendEmail(
      admin.email,
      `Task status updated: ${task.title}`,
      statusUpdatedTemplate(admin.name, employee.name, task.title, oldStatus, status)
    );
  });

  const updatedTask = await Task.findById(task._id)
    .populate({ path: 'assignedTo', select: 'name email' })
    .populate({ path: 'assignedBy', select: 'name email' });

  res.json({
    success: true,
    data: updatedTask,
    message: 'Status updated and admin notified'
  });
});

module.exports = { createTask, getTasks, getTaskStats, getMyTasks, updateTaskStatus };
