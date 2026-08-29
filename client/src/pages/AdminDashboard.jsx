import { useCallback, useEffect, useState } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import StatsCards from '../components/admin/StatsCards';
import TaskTable from '../components/admin/TaskTable';
import AssignTaskModal from '../components/admin/AssignTaskModal';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import { TableSkeleton } from '../components/common/Loader';
import { fetchTasks, fetchTaskStats, createTask } from '../services/taskService';
import { fetchEmployees } from '../services/employeeService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, totalItems: 0, limit: 10 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchTasks({ page, limit: 10, search: search || undefined });
      setTasks(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to load tasks', error);
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchTaskStats();
      setStats(data.data);
    } catch (error) {
      console.error('Failed to load stats', error);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const openModal = async () => {
    setModalOpen(true);
    setEmployeesLoading(true);
    try {
      const data = await fetchEmployees();
      setEmployees(data.data);
    } catch (error) {
      console.error('Failed to load employees', error);
    } finally {
      setEmployeesLoading(false);
    }
  };

  const handleCreateTask = async (form) => {
    await createTask(form);
    await Promise.all([loadTasks(), loadStats()]);
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
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Manage employees, assign tasks and monitor progress</p>
        </div>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
        >
          + Assign New Task
        </button>
      </div>

      <StatsCards stats={stats} />

      <div className="mb-4">
        <SearchBar placeholder="Search by task title or employee name..." onSearch={handleSearch} />
      </div>

      {loading ? (
        <TableSkeleton rows={5} cols={6} />
      ) : (
        <>
          <TaskTable tasks={tasks} />
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      <AssignTaskModal
        open={modalOpen}
        employees={employees}
        loading={employeesLoading}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </DashboardLayout>
  );
};

export default AdminDashboard;
