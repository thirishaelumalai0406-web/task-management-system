const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const { ROLES, TASK_STATUS } = require('../utils/constants');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to database'.cyan.underline);

    // Clear existing data
    await Task.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing users and tasks'.yellow);

    // Create admin
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'Admin@123',
      role: ROLES.ADMIN
    });

    // Create 3 employees
    const employees = await User.create([
      { name: 'Employee One', email: 'employee1@test.com', password: 'Employee@123', role: ROLES.EMPLOYEE },
      { name: 'Employee Two', email: 'employee2@test.com', password: 'Employee@123', role: ROLES.EMPLOYEE },
      { name: 'Employee Three', email: 'employee3@test.com', password: 'Employee@123', role: ROLES.EMPLOYEE }
    ]);

    const [emp1, emp2, emp3] = employees;

    // Create sample tasks with varied priorities/status
    const sampleTasks = [
      {
        title: 'Design landing page',
        description: 'Create a responsive landing page for the new product launch using Tailwind CSS.',
        assignedTo: emp1._id,
        assignedBy: admin._id,
        priority: 'High',
        status: TASK_STATUS.IN_PROGRESS
      },
      {
        title: 'Fix login validation bug',
        description: 'Users are able to submit invalid email formats. Add proper client and server validation.',
        assignedTo: emp1._id,
        assignedBy: admin._id,
        priority: 'Medium',
        status: TASK_STATUS.COMPLETED
      },
      {
        title: 'Write API documentation',
        description: 'Document all REST endpoints with request/response examples for the developer handoff.',
        assignedTo: emp2._id,
        assignedBy: admin._id,
        priority: 'Low',
        status: TASK_STATUS.NOT_STARTED
      },
      {
        title: 'Implement search and pagination',
        description: 'Add search filters and pagination to the tasks listing page with debounced input.',
        assignedTo: emp2._id,
        assignedBy: admin._id,
        priority: 'High',
        status: TASK_STATUS.IN_PROGRESS
      },
      {
        title: 'Set up email notifications',
        description: 'Configure Nodemailer to send task assignment and status update emails.',
        assignedTo: emp3._id,
        assignedBy: admin._id,
        priority: 'Medium',
        status: TASK_STATUS.NOT_STARTED
      },
      {
        title: 'Prepare deployment checklist',
        description: 'Compile environment variables, build steps, and hosting requirements for production.',
        assignedTo: emp3._id,
        assignedBy: admin._id,
        priority: 'Low',
        status: TASK_STATUS.COMPLETED
      }
    ];

    await Task.insertMany(sampleTasks);

    console.log('='.repeat(50).green);
    console.log('Seed complete! Credentials:'.green.bold);
    console.log('='.repeat(50).green);
    console.log('Admin:'.yellow);
    console.log(`  Email:    admin@test.com`);
    console.log(`  Password: Admin@123`);
    console.log('Employees:'.yellow);
    console.log(`  employee1@test.com / Employee@123`);
    console.log(`  employee2@test.com / Employee@123`);
    console.log(`  employee3@test.com / Employee@123`);
    console.log('='.repeat(50).green);

    await mongoose.disconnect();
    console.log('Database connection closed'.cyan);
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`.red.bold);
    process.exit(1);
  }
};

seedDB();
