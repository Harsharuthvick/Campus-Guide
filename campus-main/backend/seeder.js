const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Business = require('./models/Business');

dotenv.config();

const businesses = [
  {
    name: 'Campus Bites',
    category: 'Food',
    location: 'Near Main Gate',
    description: 'Quick meals, sandwiches, and fresh juice for students between classes.',
    contactInfo: '+91 98765 10001',
    phoneNumber: '+91 98765 10001',
    openingTime: '08:00',
    closingTime: '21:30',
    items: ['Sandwiches', 'Juice', 'Tea', 'Paratha']
  },
  {
    name: 'Noodle Corner',
    category: 'Food',
    location: 'Food Street, Block B',
    description: 'Affordable noodles, momos, and tea with late evening service.',
    contactInfo: '+91 98765 10002',
    phoneNumber: '+91 98765 10002',
    openingTime: '11:00',
    closingTime: '23:00',
    items: ['Noodles', 'Momos', 'Fried Rice', 'Tea']
  },
  {
    name: 'Pen Point Stationers',
    category: 'Stationery',
    location: 'Academic Block Ground Floor',
    description: 'Notebooks, pens, printouts, files, and basic project supplies.',
    contactInfo: '+91 98765 10003',
    phoneNumber: '+91 98765 10003',
    openingTime: '09:00',
    closingTime: '18:30',
    items: ['Notebooks', 'Pens', 'Files', 'Charts']
  },
  {
    name: 'Print Hub',
    category: 'Stationery',
    location: 'Library Lane',
    description: 'Fast printing, photocopying, spiral binding, and assignment supplies.',
    contactInfo: '+91 98765 10004',
    phoneNumber: '+91 98765 10004',
    openingTime: '08:30',
    closingTime: '20:00',
    items: ['Printouts', 'Photocopy', 'Binding', 'Lamination']
  },
  {
    name: 'Green Stay PG',
    category: 'PG Accommodation',
    location: 'Sector 12, 800m from campus',
    description: 'Clean rooms with Wi-Fi, meals, laundry, and security for students.',
    contactInfo: '+91 98765 10005',
    phoneNumber: '+91 98765 10005',
    openingTime: '07:00',
    closingTime: '22:00',
    items: ['Single Room', 'Shared Room', 'Meals', 'Laundry']
  },
  {
    name: 'Scholars Nest',
    category: 'PG Accommodation',
    location: 'College Road',
    description: 'Budget-friendly shared rooms with study area and daily housekeeping.',
    contactInfo: '+91 98765 10006',
    phoneNumber: '+91 98765 10006',
    openingTime: '06:30',
    closingTime: '22:30',
    items: ['Shared Room', 'Study Area', 'Housekeeping', 'Wi-Fi']
  }
];

const businessesWithRatings = businesses.map((business) => ({
  ...business,
  averageRating: Number((Math.random() * 4 + 1).toFixed(1))
}));

const seedBusinesses = async () => {
  try {
    await connectDB();
    await Business.deleteMany({});
    await Business.insertMany(businessesWithRatings);
    console.log('Sample businesses seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedBusinesses();
