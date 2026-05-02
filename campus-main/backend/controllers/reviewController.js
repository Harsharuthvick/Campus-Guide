const Business = require('../models/Business');
const Review = require('../models/Review');

const getReviewsByBusiness = async (req, res) => {
  try {
    const reviews = await Review.find({ businessId: req.params.businessId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    return res.status(200).json(reviews);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};

const addReview = async (req, res) => {
  try {
    const { rating, reviewText } = req.body;
    const { businessId } = req.params;

    if (!rating || !reviewText) {
      return res.status(400).json({ message: 'Rating and review text are required' });
    }

    const business = await Business.findById(businessId);
    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    const existingReview = await Review.findOne({
      userId: req.user.id,
      businessId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this business' });
    }

    const review = await Review.create({
      userId: req.user.id,
      businessId,
      rating,
      reviewText
    });

    const reviews = await Review.find({ businessId });
    const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
    business.averageRating = Number((totalRating / reviews.length).toFixed(1));
    await business.save();

    const populatedReview = await Review.findById(review._id).populate('userId', 'name');
    return res.status(201).json(populatedReview);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'You have already reviewed this business' });
    }

    return res.status(500).json({ message: 'Failed to add review' });
  }
};

module.exports = { getReviewsByBusiness, addReview };
