const Business = require('../models/Business');

const getAllBusinesses = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const businesses = await Business.find(filter).sort({ createdAt: -1 });
    return res.status(200).json(businesses);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch businesses' });
  }
};

const getBusinessById = async (req, res) => {
  try {
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    return res.status(200).json(business);
  } catch (error) {
    return res.status(404).json({ message: 'Business not found' });
  }
};

const getOwnerBusiness = async (req, res) => {
  try {
    const business = await Business.findOne({ claimedBy: req.user.id });
    return res.status(200).json({ business: business || null });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch business profile' });
  }
};

const getTopRated = async (req, res) => {
  try {
    const businesses = await Business.find()
      .sort({ averageRating: -1, createdAt: -1 })
      .limit(10);

    return res.status(200).json(businesses);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to fetch top-rated businesses' });
  }
};

const createBusiness = async (req, res) => {
  try {
    const {
      name,
      category,
      location,
      description,
      contactInfo,
      phoneNumber,
      openingTime,
      closingTime,
      items
    } = req.body;

    if (!name || !category || !location) {
      return res.status(400).json({ message: 'Name, category, and location are required' });
    }

    const existingBusiness = await Business.findOne({ claimedBy: req.user.id });
    if (existingBusiness) {
      return res.status(400).json({ message: 'You already have a business profile' });
    }

    const business = await Business.create({
      name,
      category,
      location,
      description,
      contactInfo: contactInfo || phoneNumber || '',
      phoneNumber: phoneNumber || contactInfo || '',
      openingTime: openingTime || '',
      closingTime: closingTime || '',
      items: Array.isArray(items) ? items : [],
      claimedBy: req.user.id
    });

    return res.status(201).json(business);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create business profile' });
  }
};

const updateBusinessInfo = async (req, res) => {
  try {
    const {
      name,
      category,
      location,
      contactInfo,
      phoneNumber,
      description,
      openingTime,
      closingTime,
      items
    } = req.body;
    const business = await Business.findById(req.params.id);

    if (!business) {
      return res.status(404).json({ message: 'Business not found' });
    }

    if (!business.claimedBy || business.claimedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You can update only your business profile' });
    }

    if (name !== undefined) {
      business.name = name;
    }

    if (category !== undefined) {
      business.category = category;
    }

    if (location !== undefined) {
      business.location = location;
    }

    if (contactInfo !== undefined) {
      business.contactInfo = contactInfo;
    }

    if (phoneNumber !== undefined) {
      business.phoneNumber = phoneNumber;
      business.contactInfo = phoneNumber;
    }

    if (description !== undefined) {
      business.description = description;
    }

    if (openingTime !== undefined) {
      business.openingTime = openingTime;
    }

    if (closingTime !== undefined) {
      business.closingTime = closingTime;
    }

    if (items !== undefined) {
      business.items = Array.isArray(items) ? items : [];
    }

    await business.save();
    return res.status(200).json(business);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to update business' });
  }
};

module.exports = {
  getAllBusinesses,
  getBusinessById,
  getOwnerBusiness,
  getTopRated,
  createBusiness,
  updateBusinessInfo
};
