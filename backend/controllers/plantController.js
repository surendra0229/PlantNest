const Plant = require('../models/Plant');
const Category = require('../models/Category');
const { deleteFromCloudinary, extractPublicId } = require('../config/cloudinary');

// @desc    Get all plants with search, filter, sort and pagination
// @route   GET /api/plants
// @access  Public
const getPlants = async (req, res, next) => {
  try {

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 24;
    const skip = (page - 1) * limit;

    const andConditions = [];

    // Search keyword
    if (req.query.search && req.query.search.trim()) {
      const searchRegex = new RegExp(req.query.search.trim(), 'i');
      andConditions.push({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { category: searchRegex },
          { plantType: searchRegex }
        ]
      });
    }

    // Category filter
    if (req.query.category && req.query.category !== 'All') {
      const catWord = req.query.category.trim().split(' ')[0];
      const catRegex = new RegExp(catWord, 'i');
      andConditions.push({
        $or: [
          { category: catRegex },
          { plantType: catRegex }
        ]
      });
    }

    // Plant Type filter
    if (req.query.plantType && req.query.plantType !== 'All') {
      const typeRegex = new RegExp(req.query.plantType.trim(), 'i');
      andConditions.push({ plantType: typeRegex });
    }

    // Sunlight filter
    if (req.query.sunlight && req.query.sunlight !== 'All') {
      const sunRegex = new RegExp(req.query.sunlight.trim(), 'i');
      andConditions.push({ sunlight: sunRegex });
    }

    // Stock availability filter
    if (req.query.inStock === 'true') {
      andConditions.push({ stock: { $gt: 0 }, isAvailable: true });
    }

    // Price range filter
    if (req.query.minPrice || (req.query.maxPrice && Number(req.query.maxPrice) < 200)) {
      const minP = req.query.minPrice ? Number(req.query.minPrice) : 0;
      const maxP = req.query.maxPrice ? Number(req.query.maxPrice) : 999999;
      
      andConditions.push({
        $or: [
          { finalPrice: { $gte: minP, $lte: maxP } },
          { price: { $gte: minP, $lte: maxP }, finalPrice: { $exists: false } }
        ]
      });
    }

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    // Sorting
    let sort = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sort = { finalPrice: 1, price: 1 };
    if (req.query.sort === 'price-desc') sort = { finalPrice: -1, price: -1 };
    if (req.query.sort === 'name-asc') sort = { name: 1 };
    if (req.query.sort === 'newest') sort = { createdAt: -1 };

    const total = await Plant.countDocuments(query);
    const plants = await Plant.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: plants.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      plants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single plant details
// @route   GET /api/plants/:id
// @access  Public
const getPlantById = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    const relatedPlants = await Plant.find({
      category: plant.category,
      _id: { $ne: plant._id }
    }).limit(4);

    res.status(200).json({
      success: true,
      plant,
      relatedPlants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new plant
// @route   POST /api/plants
// @access  Private (Admin)
const createPlant = async (req, res, next) => {
  try {
    const {
      name,
      category,
      description,
      price,
      discount,
      stock,
      plantType,
      sunlight,
      water,
      soil,
      careInstructions,
      images,
      isAvailable
    } = req.body;

    if (!name || !category || !description || price === undefined || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required plant fields.'
      });
    }

    const plantImages = (images && Array.isArray(images) && images.length > 0) ? images.filter(Boolean) : [];

    const plant = new Plant({
      name,
      category,
      description,
      price: Number(price),
      discount: Number(discount || 0),
      stock: Number(stock),
      plantType: plantType || 'Indoor',
      sunlight: sunlight || 'Indirect Sunlight',
      water: water || 'Moderate (Weekly)',
      soil: soil || 'Well-draining potting mix',
      careInstructions: careInstructions || 'Keep in moderate temperature and water when top soil dries.',
      images: plantImages,
      isAvailable: isAvailable !== undefined ? isAvailable : (Number(stock) > 0)
    });

    const savedPlant = await plant.save();

    res.status(201).json({
      success: true,
      plant: savedPlant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update plant with automatic Cloudinary old asset cleanup
// @route   PUT /api/plants/:id
// @access  Private (Admin)
const updatePlant = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    // Clean up old Cloudinary images if replaced
    if (req.body.images && Array.isArray(req.body.images) && req.body.images.length > 0) {
      const oldImages = plant.images || [];
      const newImages = req.body.images;
      const removedImages = oldImages.filter(oldUrl => !newImages.includes(oldUrl));

      for (const oldUrl of removedImages) {
        const publicId = extractPublicId(oldUrl);
        if (publicId) {
          deleteFromCloudinary(publicId).catch(err => console.warn('Cloudinary delete error:', err.message));
        }
      }
    }

    const fields = [
      'name', 'category', 'description', 'price', 'discount',
      'stock', 'plantType', 'sunlight', 'water', 'soil',
      'careInstructions', 'images', 'isAvailable'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        plant[field] = req.body[field];
      }
    });

    const updatedPlant = await plant.save();

    res.status(200).json({
      success: true,
      plant: updatedPlant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete plant with automatic Cloudinary asset cleanup
// @route   DELETE /api/plants/:id
// @access  Private (Admin)
const deletePlant = async (req, res, next) => {
  try {
    const plant = await Plant.findById(req.params.id);
    if (!plant) {
      return res.status(404).json({ success: false, message: 'Plant not found' });
    }

    // Delete associated Cloudinary images
    const oldImages = plant.images || [];
    for (const oldUrl of oldImages) {
      const publicId = extractPublicId(oldUrl);
      if (publicId) {
        deleteFromCloudinary(publicId).catch(err => console.warn('Cloudinary delete error:', err.message));
      }
    }

    await plant.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Plant deleted successfully and Cloudinary images removed.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get categories
// @route   GET /api/plants/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getCategories
};
