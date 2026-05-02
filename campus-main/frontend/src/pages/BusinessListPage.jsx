import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios.js';
import BusinessCard from '../components/BusinessCard.jsx';
import CategoryFilter from '../components/CategoryFilter.jsx';

const BusinessListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      setError('');

      try {
        const endpoint =
          selectedCategory === 'All' ? '/businesses' : `/businesses?category=${encodeURIComponent(selectedCategory)}`;
        const response = await api.get(endpoint);
        setBusinesses(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load businesses');
      } finally {
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    if (category === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="rounded-md bg-sky-100 px-3 py-1 text-sm font-bold text-sky-700">
            Browse campus favorites
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-950">Business Listings</h1>
          <p className="mt-2 text-slate-600">Browse campus-area spots by category.</p>
        </div>
        <CategoryFilter selectedCategory={selectedCategory} onChange={handleCategoryChange} />
      </div>
      </div>

      {loading && <p className="mt-8 text-slate-600">Loading businesses...</p>}
      {error && <p className="mt-8 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {!loading && !error && businesses.length === 0 && (
        <p className="mt-8 rounded-md bg-white p-4 text-slate-600">No businesses found for this category.</p>
      )}
      {!loading && !error && businesses.length > 0 && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <BusinessCard key={business._id} business={business} />
          ))}
        </div>
      )}
    </section>
  );
};

export default BusinessListPage;
