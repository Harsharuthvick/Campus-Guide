const express = require('express');
const {
  getAllBusinesses,
  getBusinessById,
  getOwnerBusiness,
  getTopRated,
  createBusiness,
  updateBusinessInfo
} = require('../controllers/businessController');
const { protect, isOwner } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllBusinesses);
router.get('/top-rated', getTopRated);
router.get('/owner/me', protect, isOwner, getOwnerBusiness);
router.post('/', protect, isOwner, createBusiness);
router.get('/:id', getBusinessById);
router.put('/:id/update', protect, isOwner, updateBusinessInfo);

module.exports = router;
