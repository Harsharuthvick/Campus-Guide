import StarRating from './StarRating.jsx';

const ReviewCard = ({ review }) => {
  const reviewerName = review.userId?.name || 'Campus user';
  const date = new Date(review.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-slate-950">{reviewerName}</h4>
          <p className="text-sm text-slate-500">{date}</p>
        </div>
        <div className="rounded-md bg-amber-50 px-3 py-2">
          <StarRating rating={review.rating} />
        </div>
      </div>
      <p className="mt-4 leading-7 text-slate-700">{review.reviewText}</p>
    </article>
  );
};

export default ReviewCard;
