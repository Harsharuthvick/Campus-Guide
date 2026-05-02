import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios.js';
import ReviewCard from '../components/ReviewCard.jsx';
import StarRating from '../components/StarRating.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getBusinessStatus } from '../utils/businessStatus.js';

const BusinessDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reviewError, setReviewError] = useState('');

  const fetchDetails = async () => {
    setLoading(true);
    setError('');

    try {
      const [businessResponse, reviewsResponse] = await Promise.all([
        api.get(`/businesses/${id}`),
        api.get(`/reviews/${id}`)
      ]);

      setBusiness(businessResponse.data);
      setReviews(reviewsResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load business details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setReviewError('');

    if (!rating) {
      setReviewError('Please select a star rating');
      return;
    }

    setSubmitting(true);

    try {
      await api.post(`/reviews/${id}`, { rating, reviewText });
      setRating(0);
      setReviewText('');
      await fetchDetails();
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Unable to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-6xl px-4 py-10 text-slate-600">Loading business details...</p>;
  }

  if (error) {
    return <p className="mx-auto max-w-6xl px-4 py-10 text-red-700">{error}</p>;
  }

  if (!business) {
    return <p className="mx-auto max-w-6xl px-4 py-10 text-slate-600">Business not found.</p>;
  }

  const status = getBusinessStatus(business);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="h-2 bg-teal-600" />
        <div className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <span className="rounded-md bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800">
              {business.category}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-950">{business.name}</h1>
            <p className="mt-2 text-slate-600">{business.location}</p>
          </div>
          <div className="rounded-md border border-slate-200 bg-slate-50 px-4 py-3">
            <StarRating rating={business.averageRating} />
            <span className="mt-1 block text-sm font-bold text-slate-700">
              {Number(business.averageRating || 0).toFixed(1)} average
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-md px-3 py-1 text-sm font-semibold ${
              status.isOpen === null
                ? 'bg-slate-100 text-slate-600'
                : status.isOpen
                  ? 'bg-teal-50 text-teal-700'
                  : 'bg-rose-50 text-rose-700'
            }`}
          >
            {status.label}
          </span>
          <span className="text-sm text-slate-600">{status.hoursText}</span>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h2 className="font-semibold text-slate-950">Description</h2>
            <p className="mt-2 leading-7 text-slate-700">{business.description || 'No description available.'}</p>
          </div>
          <div>
            <h2 className="font-semibold text-slate-950">Phone Number</h2>
            <p className="mt-2 leading-7 text-slate-700">
              {business.phoneNumber || business.contactInfo || 'No phone number available.'}
            </p>
          </div>
          <div className="md:col-span-2">
            <h2 className="font-semibold text-slate-950">Items</h2>
            {business.items?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {business.items.map((item) => (
                  <span key={item} className="rounded-md bg-sky-50 px-3 py-1 text-sm font-bold text-sky-700">
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-2 leading-7 text-slate-700">No items listed.</p>
            )}
          </div>
        </div>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-950">Reviews</h2>
          {reviews.length === 0 ? (
            <p className="mt-5 rounded-md bg-white p-4 text-slate-600">No reviews yet.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {reviews.map((review) => (
                <ReviewCard key={review._id} review={review} />
              ))}
            </div>
          )}
        </div>

        {isAuthenticated && (
          <form onSubmit={handleSubmit} className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-extrabold text-slate-950">Write a Review</h2>
            <div className="mt-4">
              <StarRating rating={rating} interactive onRate={setRating} />
            </div>
            <label className="mt-4 block">
              <span className="text-sm font-medium text-slate-700">Review</span>
              <textarea
                value={reviewText}
                onChange={(event) => setReviewText(event.target.value)}
                rows="5"
                className="mt-1 w-full rounded-md border border-slate-300 bg-slate-50 px-3 py-2 focus:border-teal-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-100"
                required
              />
            </label>

            {reviewError && <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{reviewError}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full rounded-md bg-teal-600 px-4 py-2 font-bold text-white shadow-sm hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default BusinessDetailPage;
