import PriorityBadge from '../common/PriorityBadge';
import StatusBadge from '../common/StatusBadge';
import EmptyState from '../common/EmptyState';

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const TaskTable = ({ tasks }) => {
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
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Updated Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {tasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900">{task.title}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-700">{task.assignedTo?.name || '-'}</div>
                  <div className="text-xs text-gray-400">{task.assignedTo?.email || ''}</div>
                </td>
                <td className="px-4 py-3">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(task.createdAt)}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{formatDate(task.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
