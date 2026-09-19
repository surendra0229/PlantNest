const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a plant name'],
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price must be positive']
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  finalPrice: {
    type: Number,
    min: 0
  },
  stock: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 10,
    index: true
  },
  isAvailable: {
    type: Boolean,
    default: true,
    index: true
  },
  images: [{
    type: String
  }],
  plantType: {
    type: String,
    required: true,
    enum: ['Indoor', 'Outdoor', 'Flowering', 'Succulent', 'Bonsai', 'Herb', 'Fruit', 'Air Plant'],
    default: 'Indoor',
    index: true
  },
  sunlight: {
    type: String,
    required: true,
    enum: ['Low Light', 'Indirect Sunlight', 'Full Sun', 'Partial Shade'],
    default: 'Indirect Sunlight'
  },
  water: {
    type: String,
    required: true,
    enum: ['Low (Every 2 weeks)', 'Moderate (Weekly)', 'Frequent (2-3 times/week)'],
    default: 'Moderate (Weekly)'
  },
  soil: {
    type: String,
    default: 'Well-draining potting mix rich in organic matter'
  },
  careInstructions: {
    type: String,
    required: true,
    default: 'Keep in warm temperature (18-25°C). Water when top 2 inches of soil feel dry.'
  }
}, { timestamps: true });

// Auto-calculate finalPrice and update isAvailable before saving
plantSchema.pre('save', function (next) {
  if (this.price !== undefined && this.discount !== undefined) {
    this.finalPrice = Math.round(this.price * (1 - this.discount / 100));
  } else if (this.price !== undefined) {
    this.finalPrice = this.price;
  }
  
  // Set availability based on stock
  if (this.stock <= 0) {
    this.isAvailable = false;
  } else if (this.isModified('stock') && this.stock > 0) {
    this.isAvailable = true;
  }
  
  next();
});

// Create text index for high performance search queries
plantSchema.index({ name: 'text', description: 'text', category: 'text', plantType: 'text' });

module.exports = mongoose.model('Plant', plantSchema);
