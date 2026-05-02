const express = require('express');
const { getReviewsByBusiness, addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:businessId', getReviewsByBusiness);
router.post('/:businessId', protect, addReview);

module.exports = router;
