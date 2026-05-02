import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
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
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-[1fr_420px] md:items-center">
      <div className="hidden rounded-lg border border-slate-200 bg-white p-8 shadow-glow md:block">
        <p className="text-sm font-bold text-teal-700">Student or owner</p>
        <h1 className="mt-4 text-4xl font-extrabold text-slate-950">Join the campus local network.</h1>
        <p className="mt-5 leading-7 text-slate-600">Students review nearby places. Owners create profiles, update details, and track feedback from one dashboard.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-slate-950">Create Account</h1>
        <p className="mt-2 text-sm text-slate-600">Use the role field to register as a student or business owner.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Name</span>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
              required
            />
          </label>

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

          <label className="block">
            <span className="text-sm font-medium text-slate-700">Register as</span>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
            >
              <option value="student">Student</option>
              <option value="owner">Owner</option>
            </select>
          </label>

          {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-teal-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-coral-700">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
};

export default RegisterPage;
