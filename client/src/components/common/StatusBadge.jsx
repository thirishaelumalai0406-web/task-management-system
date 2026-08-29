const statusStyles = {
  'Not Started': 'bg-gray-100 text-gray-600',
  'In Progress': 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700'
};

const StatusBadge = ({ status }) => {
  if (!status) return null;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        statusStyles[status] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
