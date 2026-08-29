const mongoose = require('mongoose');
const { TASK_STATUS, PRIORITY } = require('../utils/constants');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 2000
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    priority: {
      type: String,
      enum: [PRIORITY.HIGH, PRIORITY.MEDIUM, PRIORITY.LOW],
      default: PRIORITY.MEDIUM
    },
    status: {
      type: String,
      enum: [TASK_STATUS.NOT_STARTED, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED],
      default: TASK_STATUS.NOT_STARTED
    }
  },
  { timestamps: true }
);

// Text index for title search
taskSchema.index({ title: 'text' });
// Indexes for frequent filters
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ status: 1 });

module.exports = mongoose.model('Task', taskSchema);
