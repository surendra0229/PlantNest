import React, { useState, useEffect } from 'react';
import { plantService, getBackendUrl } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/layout/AdminLayout';
import ImageInputManager from '../../components/admin/ImageInputManager';
import {
  Sprout,
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  Loader2,
  Check,
  AlertCircle,
  IndianRupee,
  Layers,
  Sparkles
} from 'lucide-react';

const AdminPlants = () => {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal controls
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Indoor Plants',
    description: '',
    price: '',
    discount: '0',
    stock: '10',
    plantType: 'Indoor',
    sunlight: 'Indirect Sunlight',
    water: 'Moderate (Weekly)',
    soil: 'Well-draining potting mix',
    careInstructions: 'Keep in warm environment and water when top soil dries out.',
    images: '',
    isAvailable: true
  });

  const { toast } = useToast();

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const res = await plantService.getPlants({ limit: 100, search });
      if (res.success) setPlants(res.plants);
    } catch (err) {
      toast.error('Failed to load plant catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
    plantService.getCategories().then((res) => {
      if (res.success && res.categories) setCategories(res.categories);
    });
  }, [search]);

  const handleOpenAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: '',
      category: categories[0]?.name || 'Indoor Plants',
      description: '',
      price: '',
      discount: '0',
      stock: '10',
      plantType: 'Indoor',
      sunlight: 'Indirect Sunlight',
      water: 'Moderate (Weekly)',
      soil: 'Well-draining potting mix',
      careInstructions: 'Keep in warm environment and water when top soil dries out.',
      images: '',
      isAvailable: true
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (plant) => {
    setIsEditing(true);
    setCurrentId(plant._id);
    setFormData({
      name: plant.name,
      category: plant.category,
      description: plant.description,
      price: plant.price.toString(),
      discount: (plant.discount || 0).toString(),
      stock: plant.stock.toString(),
      plantType: plant.plantType || 'Indoor',
      sunlight: plant.sunlight || 'Indirect Sunlight',
      water: plant.water || 'Moderate (Weekly)',
      soil: plant.soil || '',
      careInstructions: plant.careInstructions || '',
      images: plant.images?.[0] || '',
      isAvailable: plant.isAvailable
    });
    setShowModal(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) {
      toast.error('Please fill in required text fields (Name, Price, Stock).');
      return;
    }

    if (!formData.images) {
      toast.error('Product image is required! Please upload an image or capture a photo.');
      return;
    }

    const payload = {
      ...formData,
      price: Number(formData.price),
      discount: Number(formData.discount),
      stock: Number(formData.stock),
      images: [formData.images]
    };

    try {
      setSubmitting(true);
      if (isEditing) {
        const res = await plantService.updatePlant(currentId, payload);
        if (res.success) {
          toast.success(`Updated ${res.plant.name}`);
          setShowModal(false);
          fetchPlants();
        }
      } else {
        const res = await plantService.createPlant(payload);
        if (res.success) {
          toast.success(`Added ${res.plant.name} to catalog.`);
          setShowModal(false);
          fetchPlants();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePlant = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from nursery catalog?`)) return;
    try {
      const res = await plantService.deletePlant(id);
      if (res.success) {
        toast.success(`Deleted ${name}`);
        fetchPlants();
      }
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    }
  };

  return (
    <AdminLayout>
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Plant Catalog Management
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Add species, manage pricing in ₹, set discounts, update inventory, and capture high-res photos.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4 text-amber-300" />
          Add New Product
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <input
          type="text"
          placeholder="Search plant inventory by name, category, or plant type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-xs focus:outline-none"
        />
      </div>

      {/* Plants Catalog Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="p-4">Plant</th>
                <th className="p-4">Category</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price (₹)</th>
                <th className="p-4">Final Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                    Loading catalog items...
                  </td>
                </tr>
              ) : plants.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400">
                    No plants found in inventory.
                  </td>
                </tr>
              ) : (
                plants.map((plant) => {
                  const imgUrl = plant.images?.[0];
                  const fullImgSrc = imgUrl?.startsWith('http') || imgUrl?.startsWith('/')
                    ? imgUrl
                    : `${getBackendUrl()}${imgUrl}`;

                  return (
                    <tr key={plant._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {imgUrl && (
                            <img
                              src={fullImgSrc}
                              alt={plant.name}
                              className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                            />
                          )}
                          <div>
                            <span className="font-extrabold text-slate-900 dark:text-white block">{plant.name}</span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold">{plant.sunlight || 'Indirect Light'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">{plant.category}</td>
                      <td className="p-4 font-semibold text-slate-600 dark:text-slate-300">{plant.plantType}</td>
                      <td className="p-4 font-mono font-bold">₹{plant.price}</td>
                      <td className="p-4 font-mono font-extrabold text-emerald-700 dark:text-emerald-400">
                        ₹{plant.finalPrice || plant.price}
                        {plant.discount > 0 && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-extrabold">
                            -{plant.discount}%
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                          plant.stock <= 5
                            ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                        }`}>
                          {plant.stock} units left
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(plant)}
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-600 hover:text-white transition cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePlant(plant._id, plant.name)}
                            className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-5 max-h-[92vh] overflow-y-auto animate-scale-in">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                  {isEditing ? 'Edit Plant Species' : 'Add New Plant Species'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-4 text-xs">
              
              {/* Image Manager Input */}
              <ImageInputManager
                value={formData.images}
                onChange={(url) => setFormData({ ...formData, images: url })}
                label="Product Image (Upload File or Take Photo)"
              />

              {/* Grid 1: Basic Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Plant Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Monstera Deliciosa"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-semibold focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c._id || c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Price (₹) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="e.g., 499"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Discount (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="0"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
                    Stock Quantity <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="10"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-bold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Plant Type</label>
                  <select
                    value={formData.plantType}
                    onChange={(e) => setFormData({ ...formData, plantType: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-semibold focus:outline-none"
                  >
                    {['Indoor', 'Outdoor', 'Flowering', 'Succulent', 'Bonsai', 'Herb', 'Fruit'].map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">
                  Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Describe plant characteristics, size, and features..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              {/* Plant Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Sunlight Needs</label>
                  <select
                    value={formData.sunlight}
                    onChange={(e) => setFormData({ ...formData, sunlight: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-semibold focus:outline-none"
                  >
                    {['Low Light', 'Indirect Sunlight', 'Full Sun', 'Partial Shade'].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Watering Schedule</label>
                  <select
                    value={formData.water}
                    onChange={(e) => setFormData({ ...formData, water: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 font-semibold focus:outline-none"
                  >
                    {['Low (Every 2 weeks)', 'Moderate (Weekly)', 'Frequent (2-3 times/week)'].map((w) => (
                      <option key={w} value={w}>{w}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-700 dark:text-slate-300 font-bold block mb-1">Care Instructions</label>
                <input
                  type="text"
                  placeholder="e.g., Keep in warm room and avoid direct midday sun."
                  value={formData.careInstructions}
                  onChange={(e) => setFormData({ ...formData, careInstructions: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 focus:outline-none"
                />
              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-lg shadow-emerald-600/30 transition flex items-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-amber-300" />
                      {isEditing ? 'Save Product Changes' : 'Publish Product'}
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </AdminLayout>
  );
};

export default AdminPlants;
