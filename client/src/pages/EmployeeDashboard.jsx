import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/common/DashboardLayout';
import MyTaskTable from '../components/employee/MyTaskTable';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import { TableSkeleton } from '../components/common/Loader';
import { fetchMyTasks, updateTaskStatus } from '../services/taskService';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0, limit: 10 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyTasks({ page, limit: 10, search: search || undefined });
      setTasks(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load my tasks', error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleStatusChange = async (taskId, newStatus) => {
    // Optimistic update
    const previousTasks = tasks;
    setTasks((prev) => prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t)));
    try {
      const data = await updateTaskStatus(taskId, newStatus);
      toast.success(data.message || 'Status updated');
      // Refresh to reflect any server-side truth
      await loadTasks();
    } catch (error) {
      // Roll back on failure
      setTasks(previousTasks);
      const msg = error.response?.data?.message || 'Failed to update status';
      toast.error(msg);
    }
  };

  const handleSearch = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Tasks</h1>
        <p className="text-gray-500 text-sm mt-1">
          {pagination.totalItems > 0
            ? `You have ${pagination.totalItems} assigned task${pagination.totalItems > 1 ? 's' : ''}`
            : 'No tasks assigned to you yet'}
        </p>
      </div>

      <div className="mb-4">
        <SearchBar placeholder="Search your tasks by title..." onSearch={handleSearch} />
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : (
        <>
          <MyTaskTable tasks={tasks} onStatusChange={handleStatusChange} />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </DashboardLayout>
  );
};

export default EmployeeDashboard;
