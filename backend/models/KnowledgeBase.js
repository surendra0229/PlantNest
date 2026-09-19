const mongoose = require('mongoose');

const knowledgeBaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Knowledge entry title is required'],
    trim: true,
    maxlength: [200, 'Title must be under 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Knowledge entry content is required'],
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['shipping', 'returns', 'contact', 'payment', 'services', 'faq', 'policy', 'products', 'care', 'other'],
    default: 'other'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('KnowledgeBase', knowledgeBaseSchema);
