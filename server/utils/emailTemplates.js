// HTML markup shown inside the email sent to an employee when a task is assigned
const taskAssignedTemplate = (employeeName, taskTitle, priority, description) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
    <h2 style="color: #1e293b;">New Task Assigned</h2>
    <p>Hi <strong>${employeeName}</strong>,</p>
    <p>A new task has been assigned to you. Please review the details below and log in to get started.</p>
    <div style="background: #f8fafc; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <p style="margin: 0 0 8px;"><strong>Task:</strong> ${taskTitle}</p>
      <p style="margin: 0 0 8px;"><strong>Priority:</strong> ${priority}</p>
      <p style="margin: 0;"><strong>Description:</strong> ${description}</p>
    </div>
    <p>Please <a href="${process.env.CLIENT_URL}">log in to your dashboard</a> to view and manage your tasks.</p>
    <p style="color: #64748b; font-size: 12px; margin-top: 24px;">This is an automated notification. Please do not reply.</p>
  </div>
  `;
};

// HTML markup shown inside the email sent to the admin when an employee updates a task status
const statusUpdatedTemplate = (adminName, employeeName, taskTitle, oldStatus, newStatus) => {
  return `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
    <h2 style="color: #1e293b;">Task Status Updated</h2>
    <p>Hi <strong>${adminName}</strong>,</p>
    <p><strong>${employeeName}</strong> updated the status of task <strong>"${taskTitle}"</strong></p>
    <div style="background: #f8fafc; padding: 16px; border-radius: 6px; margin: 16px 0;">
      <p style="margin: 0 0 8px;"><strong>Status changed:</strong></p>
      <p style="margin: 0;">
        <span style="color: #64748b;">${oldStatus}</span>
        &rarr;
        <strong style="color: #0ea5e9;">${newStatus}</strong>
      </p>
    </div>
    <p>Please <a href="${process.env.CLIENT_URL}">log in to your admin dashboard</a> to review the task.</p>
    <p style="color: #64748b; font-size: 12px; margin-top: 24px;">This is an automated notification. Please do not reply.</p>
  </div>
  `;
};

module.exports = { taskAssignedTemplate, statusUpdatedTemplate };
