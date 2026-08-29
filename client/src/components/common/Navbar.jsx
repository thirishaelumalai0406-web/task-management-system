import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-slate-800 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-slate-700"
            aria-label="Toggle sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Task Management System</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-sm">
            <span className="text-slate-300">Signed in as </span>
            <span className="font-semibold">{user?.name}</span>
            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-700 text-slate-200 uppercase">
              {user?.role}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-md bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
