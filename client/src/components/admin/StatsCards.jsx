import StatusBadge from '../common/StatusBadge';

const StatCard = ({ label, count, colorClass, icon }) => (
  <div className={`rounded-xl p-5 shadow-sm border ${colorClass}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-3xl font-bold mt-1">{count}</p>
      </div>
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/60">
        {icon}
      </div>
    </div>
  </div>
);

const StatsCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatCard
        label="Not Started"
        count={stats.notStarted}
        colorClass="bg-gray-50 border-gray-200"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
      <StatCard
        label="In Progress"
        count={stats.inProgress}
        colorClass="bg-blue-50 border-blue-200"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        }
      />
      <StatCard
        label="Completed"
        count={stats.completed}
        colorClass="bg-green-50 border-green-200"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    </div>
  );
};

export default StatsCards;
