import { Link } from 'react-router-dom';
import { getBusinessStatus } from '../utils/businessStatus.js';
import StarRating from './StarRating.jsx';

const BusinessCard = ({ business }) => {
  const description = business.description || 'No description available yet.';
  const shortDescription = description.length > 120 ? `${description.slice(0, 120)}...` : description;
  const status = getBusinessStatus(business);

  return (
    <Link
      to={`/businesses/${business._id}`}
      className="group block overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-glow"
    >
      <div className="h-1.5 bg-teal-600" />
      <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-slate-950 group-hover:text-teal-700">{business.name}</h3>
          <p className="mt-1 text-sm text-slate-600">{business.location}</p>
        </div>
        <span className="shrink-0 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
          {business.category}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <StarRating rating={business.averageRating} />
        <span className="text-sm font-medium text-slate-600">{Number(business.averageRating || 0).toFixed(1)}</span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
        <span
          className={`rounded-md px-2.5 py-1 font-semibold ${
            status.isOpen === null
              ? 'bg-slate-100 text-slate-600'
              : status.isOpen
                ? 'bg-teal-50 text-teal-700'
                : 'bg-rose-50 text-rose-700'
          }`}
        >
          {status.label}
        </span>
        <span className="text-slate-500">{status.hoursText}</span>
      </div>

      <p className="mt-4 text-sm leading-6 text-slate-700">{shortDescription}</p>
      </div>
    </Link>
  );
};

export default BusinessCard;
