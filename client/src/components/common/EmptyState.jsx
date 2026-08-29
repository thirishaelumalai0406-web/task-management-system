const EmptyState = ({ title = 'No data found', description = 'Try adjusting your search or filters.' }) => (
  <div className="text-center py-16">
    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </div>
);

export default EmptyState;
