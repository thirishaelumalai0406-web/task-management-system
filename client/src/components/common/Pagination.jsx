const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  const showRange = 1;
  const start = Math.max(1, currentPage - showRange);
  const end = Math.min(totalPages, currentPage + showRange);

  for (let i = start; i <= end; i++) {
    pageNumbers.push(i);
  }

  const baseBtn =
    'px-3 py-1.5 rounded-md text-sm border transition-colors';

  return (
    <div className="flex items-center justify-center gap-2 mt-4 flex-wrap">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`${baseBtn} ${
          currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500' : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'
        }`}
      >
        Prev
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className={`${baseBtn} bg-white hover:bg-gray-100 border-gray-300 text-gray-700`}>
            1
          </button>
          {pageNumbers[0] > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {pageNumbers.map((num) => (
        <button
          key={num}
          onClick={() => onPageChange(num)}
          className={`${baseBtn} ${
            num === currentPage
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'
          }`}
        >
          {num}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && <span className="text-gray-400">...</span>}
          <button onClick={() => onPageChange(totalPages)} className={`${baseBtn} bg-white hover:bg-gray-100 border-gray-300 text-gray-700`}>
            {totalPages}
          </button>
        </>
      )}

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`${baseBtn} ${
          currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-gray-200 text-gray-500' : 'bg-white hover:bg-gray-100 border-gray-300 text-gray-700'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
