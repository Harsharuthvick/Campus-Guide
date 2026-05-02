const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Food', 'Stationery', 'PG Accommodation']
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  contactInfo: {
    type: String,
    default: '',
    trim: true
  },
  phoneNumber: {
    type: String,
    default: '',
    trim: true
  },
  openingTime: {
    type: String,
    default: '',
    trim: true
  },
  closingTime: {
    type: String,
    default: '',
    trim: true
  },
  items: {
    type: [String],
    default: []
  },
  claimedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  averageRating: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Business', businessSchema);
