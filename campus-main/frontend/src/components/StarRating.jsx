const StarRating = ({ rating = 0, interactive = false, onRate }) => {
  const roundedRating = Math.round(Number(rating) || 0);

  return (
    <div className="flex items-center gap-1" aria-label={`${rating || 0} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => {
        const filled = value <= roundedRating;
        const baseClasses = filled ? 'text-amber-500' : 'text-slate-300';

        if (interactive) {
          return (
            <button
              key={value}
              type="button"
              onClick={() => onRate(value)}
              className={`text-2xl leading-none transition hover:text-amber-500 ${baseClasses}`}
              aria-label={`Rate ${value} stars`}
            >
              ★
            </button>
          );
        }

        return (
          <span key={value} className={`text-lg leading-none ${baseClasses}`}>
            ★
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
