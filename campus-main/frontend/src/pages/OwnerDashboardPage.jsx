import { useEffect, useMemo, useState } from 'react';
import api from '../api/axios.js';
import StarRating from '../components/StarRating.jsx';
import { getBusinessStatus } from '../utils/businessStatus.js';

const emptyForm = {
  name: '',
  category: 'Food',
  location: '',
  phoneNumber: '',
  openingTime: '',
  closingTime: '',
  items: '',
  description: ''
};

const itemsToText = (items) => (Array.isArray(items) ? items.join(', ') : '');

const textToItems = (value) =>
  value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

const buildFormData = (business) => ({
  name: business?.name || '',
  category: business?.category || 'Food',
  location: business?.location || '',
  phoneNumber: business?.phoneNumber || business?.contactInfo || '',
  openingTime: business?.openingTime || '',
  closingTime: business?.closingTime || '',
  items: itemsToText(business?.items),
  description: business?.description || ''
});

const formatDate = (dateValue) =>
  new Date(dateValue).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

const OwnerDashboardPage = () => {
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [reviewFilter, setReviewFilter] = useState('All');
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchReviews = async (businessId) => {
    setReviewsLoading(true);

    try {
      const response = await api.get(`/reviews/${businessId}`);
      setReviews(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load reviews');
    } finally {
      setReviewsLoading(false);
    }
  };

  const fetchBusinessProfile = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get('/businesses/owner/me');
      const ownedBusiness = response.data.business;

      setBusiness(ownedBusiness);
      setFormData(ownedBusiness ? buildFormData(ownedBusiness) : emptyForm);

      if (ownedBusiness) {
        await fetchReviews(ownedBusiness._id);
      } else {
        setReviews([]);
        setActiveTab('edit');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load business profile');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinessProfile();
  }, []);

  const status = business ? getBusinessStatus(business) : null;

  const ratingDistribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map((rating) => {
      const count = reviews.filter((review) => Number(review.rating) === rating).length;
      const percentage = reviews.length ? Math.round((count / reviews.length) * 100) : 0;

      return { rating, count, percentage };
    });
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'All') {
      return reviews;
    }

    return reviews.filter((review) => Number(review.rating) === Number(reviewFilter));
  }, [reviews, reviewFilter]);

  const latestReviewDate = reviews[0]?.createdAt ? formatDate(reviews[0].createdAt) : 'No reviews yet';
  const listedItems = textToItems(formData.items);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const payload = {
      ...formData,
      contactInfo: formData.phoneNumber,
      items: listedItems
    };

    try {
      if (business) {
        await api.put(`/businesses/${business._id}/update`, payload);
        setMessage('Business profile updated');
      } else {
        await api.post('/businesses', payload);
        setMessage('Business profile created');
      }

      await fetchBusinessProfile();
      setActiveTab('overview');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save business profile');
    } finally {
      setSaving(false);
    }
  };

  const tabs = business ? ['overview', 'reviews', 'edit'] : ['edit'];

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="rounded-md bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700">
            Business command center
          </span>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-950">Owner Dashboard</h1>
          <p className="mt-2 text-slate-600">Manage your own business profile and review insights.</p>
        </div>
        {business && (
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className="rounded-md bg-coral-600 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-coral-700"
          >
            Edit Business Details
          </button>
        )}
      </div>
      </div>

      {loading && <p className="mt-8 text-slate-600">Loading dashboard...</p>}
      {error && <p className="mt-8 rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {message && <p className="mt-8 rounded-md bg-teal-50 p-4 text-sm font-semibold text-teal-700">{message}</p>}

      {!loading && (
        <>
          <div className="mt-8 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-md border px-4 py-2 text-sm font-semibold capitalize transition ${
                  activeTab === tab
                    ? 'border-teal-600 bg-teal-600 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-amber-400 hover:text-amber-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && business && (
            <div className="mt-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="rounded-lg border border-teal-100 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Average Rating</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-3xl font-extrabold text-teal-700">
                      {Number(business.averageRating || 0).toFixed(1)}
                    </span>
                    <StarRating rating={business.averageRating} />
                  </div>
                </div>
                <div className="rounded-lg border border-sky-100 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Total Reviews</p>
                  <p className="mt-3 text-3xl font-extrabold text-sky-700">{reviews.length}</p>
                </div>
                <div className="rounded-lg border border-coral-100 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Shop Status</p>
                  <p className={`mt-3 text-3xl font-extrabold ${status?.isOpen ? 'text-teal-700' : 'text-rose-700'}`}>
                    {status?.label}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">{status?.hoursText}</p>
                </div>
                <div className="rounded-lg border border-amber-100 bg-white p-5 shadow-sm">
                  <p className="text-sm font-medium text-slate-500">Latest Review</p>
                  <p className="mt-3 text-lg font-extrabold text-amber-700">{latestReviewDate}</p>
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2 className="text-xl font-extrabold text-slate-950">Rating Breakdown</h2>
                    {reviewsLoading && <span className="text-sm text-slate-500">Refreshing...</span>}
                  </div>
                  <div className="mt-6 space-y-4">
                    {ratingDistribution.map((row) => (
                      <div key={row.rating} className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
                        <span className="text-sm font-semibold text-slate-700">{row.rating} star</span>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-teal-600 transition-all"
                            style={{ width: `${row.percentage}%` }}
                          />
                        </div>
                        <span className="text-right text-sm font-medium text-slate-600">{row.count}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-extrabold text-slate-950">{business.name}</h2>
                  <p className="mt-2 text-sm text-slate-600">{business.category}</p>
                  <p className="mt-4 leading-7 text-slate-700">{business.description || 'No description added yet.'}</p>
                  <div className="mt-5 space-y-2 text-sm text-slate-600">
                    <p>
                      <span className="font-semibold text-slate-800">Location:</span> {business.location}
                    </p>
                    <p>
                      <span className="font-semibold text-slate-800">Phone:</span>{' '}
                      {business.phoneNumber || business.contactInfo || 'Not added'}
                    </p>
                  </div>
                  {business.items?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">
                      {business.items.map((item) => (
                        <span key={item} className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && business && (
            <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
              <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-extrabold text-slate-950">Review Filters</h2>
                <div className="mt-4 grid gap-2">
                  {['All', '5', '4', '3', '2', '1'].map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setReviewFilter(filter)}
                      className={`rounded-md border px-3 py-2 text-left text-sm font-semibold ${
                        reviewFilter === filter
                          ? 'border-teal-600 bg-teal-50 text-teal-700'
                          : 'border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-700'
                      }`}
                    >
                      {filter === 'All' ? 'All reviews' : `${filter} star reviews`}
                    </button>
                  ))}
                </div>
              </aside>

              <section>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-extrabold text-slate-950">Customer Reviews</h2>
                  <span className="text-sm text-slate-500">{filteredReviews.length} shown</span>
                </div>

                {reviewsLoading && <p className="mt-5 text-slate-600">Loading reviews...</p>}
                {!reviewsLoading && filteredReviews.length === 0 && (
                  <p className="mt-5 rounded-md bg-white p-4 text-slate-600">No reviews match this filter.</p>
                )}
                {!reviewsLoading && filteredReviews.length > 0 && (
                  <div className="mt-5 space-y-4">
                    {filteredReviews.map((review) => (
                      <article key={review._id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-slate-950">{review.userId?.name || 'Campus user'}</h3>
                            <p className="text-sm text-slate-500">{formatDate(review.createdAt)}</p>
                          </div>
                          <StarRating rating={review.rating} />
                        </div>
                        <p className="mt-4 leading-7 text-slate-700">{review.reviewText}</p>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'edit' && (
            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
              <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-950">
                  {business ? 'Edit Your Business Details' : 'Create Your Business Profile'}
                </h2>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Business Name</span>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Category</span>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                    >
                      <option value="Food">Food</option>
                      <option value="Stationery">Stationery</option>
                      <option value="PG Accommodation">PG Accommodation</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Location</span>
                    <input
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                      required
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Phone Number</span>
                    <input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Opening Time</span>
                    <input
                      type="time"
                      name="openingTime"
                      value={formData.openingTime}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-slate-700">Closing Time</span>
                    <input
                      type="time"
                      name="closingTime"
                      value={formData.closingTime}
                      onChange={handleChange}
                      className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                    />
                  </label>
                </div>

                <label className="mt-4 block">
                  <span className="text-sm font-medium text-slate-700">Items</span>
                  <input
                    name="items"
                    value={formData.items}
                    onChange={handleChange}
                    placeholder="Tea, Notebooks, Shared Room"
                    className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                  />
                </label>

                <label className="mt-4 block">
                  <span className="text-sm font-medium text-slate-700">Description</span>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                  />
                </label>

                <button
                  type="submit"
                  disabled={saving}
                  className="mt-6 w-full rounded-md bg-teal-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? 'Saving...' : business ? 'Save Changes' : 'Create Profile'}
                </button>
              </form>

              <aside className="h-fit rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-extrabold text-slate-950">Live Preview</h2>
                <p className="mt-4 text-lg font-semibold text-slate-950">{formData.name || 'Business name'}</p>
                <p className="mt-1 text-sm text-slate-600">{formData.category}</p>
                <p className="mt-4 text-sm leading-6 text-slate-700">{formData.description || 'Business description will appear here.'}</p>
                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <p>{formData.location || 'Location not added'}</p>
                  <p>{formData.phoneNumber || 'Phone number not added'}</p>
                  <p>
                    {formData.openingTime && formData.closingTime
                      ? `${formData.openingTime} - ${formData.closingTime}`
                      : 'Hours not added'}
                  </p>
                </div>
                {listedItems.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {listedItems.map((item) => (
                      <span key={item} className="rounded-md bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {item}
                      </span>
                    ))}
                  </div>
                )}
              </aside>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default OwnerDashboardPage;
