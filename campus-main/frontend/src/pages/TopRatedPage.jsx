import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';
import CategoryFilter from '../components/CategoryFilter.jsx';
import StarRating from '../components/StarRating.jsx';
import { getBusinessStatus } from '../utils/businessStatus.js';

const TopRatedPage = () => {
  const [businesses, setBusinesses] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const response = await api.get('/businesses/top-rated');
        setBusinesses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load top-rated businesses');
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, []);

  const filteredBusinesses = useMemo(() => {
    if (selectedCategory === 'All') {
      return businesses;
    }

    return businesses.filter((business) => business.category === selectedCategory);
  }, [businesses, selectedCategory]);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="rounded-md bg-coral-50 px-3 py-1 text-sm font-bold text-coral-700">
            Student approved
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-950">Top Rated</h1>
          <p className="mt-2 text-slate-600">Ranked campus spots by average rating.</p>
        </div>
        <CategoryFilter selectedCategory={selectedCategory} onChange={setSelectedCategory} />
      </div>
      </div>

      {loading && <p className="mt-8 text-slate-600">Loading rankings...</p>}
      {error && <p className="mt-8 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!loading && !error && filteredBusinesses.length === 0 && (
        <p className="mt-8 rounded-md bg-white p-4 text-slate-600">No rated businesses found.</p>
      )}
      {!loading && !error && filteredBusinesses.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="h-1.5 bg-coral-500" />
          {filteredBusinesses.map((business, index) => {
            const status = getBusinessStatus(business);

            return (
              <div
                key={business._id}
                className="grid gap-4 border-b border-slate-100 p-5 transition last:border-b-0 hover:bg-slate-50 md:grid-cols-[70px_1fr_170px_150px_120px]"
              >
                <div className="text-2xl font-extrabold text-coral-600">#{index + 1}</div>
                <div>
                  <Link to={`/businesses/${business._id}`} className="text-lg font-bold text-slate-950 hover:text-teal-700">
                    {business.name}
                  </Link>
                  <p className="mt-1 text-sm font-medium text-slate-600">{business.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StarRating rating={business.averageRating} />
                  <span className="font-semibold text-slate-700">{Number(business.averageRating || 0).toFixed(1)}</span>
                </div>
                <span
                  className={`h-fit w-fit rounded-md px-2.5 py-1 text-sm font-semibold ${
                    status.isOpen === null
                      ? 'bg-slate-100 text-slate-600'
                      : status.isOpen
                        ? 'bg-teal-50 text-teal-700'
                        : 'bg-rose-50 text-rose-700'
                  }`}
                >
                  {status.label}
                </span>
                <Link to={`/businesses/${business._id}`} className="text-sm font-bold text-teal-700 hover:text-coral-700">
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default TopRatedPage;
