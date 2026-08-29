import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-md text-sm transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
    }`;

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-slate-900 transform transition-transform lg:transform-none ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          <span className="text-white font-bold text-sm uppercase tracking-wide">
            {isAdmin ? 'Admin Panel' : 'My Dashboard'}
          </span>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={onClose} aria-label="Close sidebar">
            &times;
          </button>
        </div>
        <nav className="p-3 space-y-1">
          {isAdmin ? (
            <>
              <NavLink to="/admin/dashboard" className={linkClass} onClick={onClose}>
                Dashboard
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/employee/dashboard" className={linkClass} onClick={onClose}>
                My Tasks
              </NavLink>
            </>
          )}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
