const Loader = () => (
  <div className="flex justify-center items-center py-16">
    <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
  </div>
);

// Skeleton rows for the task table while loading
export const TableSkeleton = ({ rows = 5, cols = 6 }) => (
  <div className="animate-pulse">
    <div className="flex items-center space-x-4">
      {Array.from({ length: cols }).map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded flex-1" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="flex items-center space-x-4 mt-6">
        {Array.from({ length: cols }).map((_, c) => (
          <div key={c} className="h-8 bg-gray-100 rounded flex-1" />
        ))}
      </div>
    ))}
  </div>
);

export default Loader;
