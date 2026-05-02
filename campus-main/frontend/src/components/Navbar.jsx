import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navLinkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-700 hover:bg-teal-50 hover:text-teal-700'
  }`;

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-10 border-b border-teal-100 bg-white/90 shadow-sm backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-slate-950">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-teal-600 text-white shadow-sm">CG</span>
            <span>Campus Guide</span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/businesses" className={navLinkClass}>
                Listings
              </NavLink>
              <NavLink to="/top-rated" className={navLinkClass}>
                Top Rated
              </NavLink>
              {user?.role === 'owner' && (
                <NavLink to="/owner/dashboard" className={navLinkClass}>
                  Owner Dashboard
                </NavLink>
              )}
            </>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:border-teal-400 hover:text-teal-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-coral-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-coral-700"
              >
                Register as Owner/Student
              </Link>
            </>
          ) : (
            <>
              <span className="text-sm font-medium text-slate-700">{user.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-700"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
