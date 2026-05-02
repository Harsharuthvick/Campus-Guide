import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import BusinessCard from '../components/BusinessCard.jsx';

const categories = [
  {
    name: 'Food',
    description: 'Canteens, cafes, snacks, and quick meals around campus.',
    accent: 'bg-coral-500'
  },
  {
    name: 'Stationery',
    description: 'Printouts, notebooks, project materials, and daily supplies.',
    accent: 'bg-sky-500'
  },
  {
    name: 'PG Accommodation',
    description: 'Student housing, shared rooms, meals, and nearby stays.',
    accent: 'bg-amber-500'
  }
];

const HomePage = () => {
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const response = await api.get('/businesses/top-rated');
        setTopRated(response.data.slice(0, 3));
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load top-rated spots');
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, []);

  const openCategory = (category) => {
    navigate(`/businesses?category=${encodeURIComponent(category)}`);
  };

  return (
    <div>
      <section className="border-b border-teal-100 bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1fr_380px] lg:items-center">
          <div className="max-w-3xl">
            <span className="rounded-md bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
              Local picks, real student reviews
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-normal text-slate-950 sm:text-5xl">
              Campus Guide - Local Spot Reviews
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              Find trusted food spots, stationery shops, and student accommodation near campus with reviews from people who use them.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/businesses"
                className="inline-flex rounded-md bg-teal-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-teal-700"
              >
                Browse Listings
              </Link>
              <Link
                to="/top-rated"
                className="inline-flex rounded-md border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-800 shadow-sm hover:border-coral-500 hover:text-coral-700"
              >
                See Top Rated
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-950 p-5 text-white shadow-glow">
            <div className="rounded-md bg-white p-4 text-slate-950">
              <p className="text-sm font-bold text-teal-700">Today near campus</p>
              <div className="mt-4 space-y-3">
                <div className="rounded-md border border-slate-100 bg-teal-50 p-4">
                  <p className="font-bold">Campus Bites</p>
                  <p className="text-sm text-slate-600">Open now · Food · 4.6 stars</p>
                </div>
                <div className="rounded-md border border-slate-100 bg-amber-50 p-4">
                  <p className="font-bold">Print Hub</p>
                  <p className="text-sm text-slate-600">Fast printouts · Stationery</p>
                </div>
                <div className="rounded-md border border-slate-100 bg-coral-50 p-4">
                  <p className="font-bold">Green Stay PG</p>
                  <p className="text-sm text-slate-600">Wi-Fi · Meals · Security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-extrabold text-slate-950">Explore Categories</h2>
          <p className="text-slate-600">Jump straight into the spots students search for most.</p>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => openCategory(category.name)}
              className="group overflow-hidden rounded-lg border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-glow"
            >
              <div className={`h-1.5 ${category.accent}`} />
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-950 group-hover:text-teal-700">{category.name}</h3>
                <p className="mt-3 leading-7 text-slate-600">{category.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-extrabold text-slate-950">Top-Rated Spots</h2>
          <Link to="/top-rated" className="text-sm font-bold text-teal-700 hover:text-coral-700">
            View all
          </Link>
        </div>

        {loading && <p className="mt-6 text-slate-600">Loading top-rated spots...</p>}
        {error && <p className="mt-6 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {!loading && !error && topRated.length === 0 && (
          <p className="mt-6 rounded-md bg-white p-4 text-slate-600">No spots available yet.</p>
        )}
        {!loading && !error && topRated.length > 0 && (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {topRated.map((business) => (
              <BusinessCard key={business._id} business={business} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
