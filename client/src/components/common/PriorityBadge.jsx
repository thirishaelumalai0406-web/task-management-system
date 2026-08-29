const priorityStyles = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low: 'bg-green-100 text-green-700'
};

const PriorityBadge = ({ priority }) => {
  if (!priority) return null;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        priorityStyles[priority] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;
