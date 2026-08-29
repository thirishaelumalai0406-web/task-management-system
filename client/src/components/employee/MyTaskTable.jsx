import { useState } from 'react';
import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed'];

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const MyTaskTable = ({ tasks, onStatusChange }) => {
  const [updatingId, setUpdatingId] = useState(null);

  const handleChange = async (taskId, newStatus) => {
    if (updatingId) return;
    setUpdatingId(taskId);
    try {
      await onStatusChange(taskId, newStatus);
    } finally {
      setUpdatingId(null);
    }
  };

  if (tasks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {tasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                </td>
                <td className="px-4 py-3">
                  <div
                    className="text-sm text-gray-600 max-w-xs truncate"
                    title={task.description}
                  >
                    {task.description}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-4 py-3">
                  {updatingId === task._id ? (
                    <StatusBadge status={task.status} />
                  ) : (
                    <select
                      value={task.status}
                      onChange={(e) => handleChange(task._id, e.target.value)}
                      className={`px-2 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        task.status === 'Completed' ? 'bg-green-50 border-green-300' : 'border-gray-300'
                      }`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(task.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyTaskTable;
