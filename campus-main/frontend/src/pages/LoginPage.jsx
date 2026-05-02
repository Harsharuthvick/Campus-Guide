import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-[1fr_420px] md:items-center">
      <div className="hidden rounded-lg border border-slate-200 bg-slate-950 p-8 text-white shadow-glow md:block">
        <p className="text-sm font-bold text-amber-300">Welcome back</p>
        <h1 className="mt-4 text-4xl font-extrabold">Find the best campus spots faster.</h1>
        <p className="mt-5 leading-7 text-slate-300">Your saved session unlocks listings, ratings, owner dashboards, and fresh reviews from the campus crowd.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-950">Login</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Email</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Password</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
              required
            />
          </label>

          {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-teal-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Need an account?{' '}
          <Link to="/register" className="font-bold text-coral-700">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
};

export default LoginPage;
