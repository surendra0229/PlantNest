import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { plantService } from '../services/api';
import { useCart } from '../context/CartContext';
import PlantCard from '../components/plants/PlantCard';
import {
  Sun,
  Droplets,
  Layers,
  ShoppingBag,
  Zap,
  CheckCircle,
  Loader2,
  ArrowLeft,
  Tag,
  ShieldCheck,
  Truck
} from 'lucide-react';

const PlantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [plant, setPlant] = useState(null);
  const [relatedPlants, setRelatedPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await plantService.getPlantById(id);
        if (data.success) {
          setPlant(data.plant);
          setRelatedPlants(data.relatedPlants || []);
          setSelectedImage(0);
          setQuantity(1);
        }
      } catch (err) {
        console.error('Error fetching plant details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 animate-spin" />
        <span className="text-xs text-slate-500 font-bold">Loading plant specifications...</span>
      </div>
    );
  }

  if (!plant) {
    return (
      <div className="max-w-md mx-auto my-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center space-y-4 shadow-xl">
        <h2 className="text-xl font-black text-slate-900 dark:text-white">Plant Not Found</h2>
        <Link to="/dashboard" className="inline-block px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-extrabold text-xs shadow">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isLowStock = plant.stock > 0 && plant.stock <= 5;
  const isOutOfStock = plant.stock <= 0 || !plant.isAvailable;
  const price = plant.finalPrice || plant.price;

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    navigate('/checkout', {
      state: {
        buyNowItem: {
          plant,
          quantity
        }
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-slate-900 dark:text-slate-100">
      
      {/* Top Navigation */}
      <div>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-sm hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Back to Dashboard Feed
        </Link>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          {plant.images?.[selectedImage] && (
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-lg">
              <img
                src={plant.images[selectedImage]}
                alt={plant.name}
                className="w-full h-full object-cover"
              />
              {plant.discount > 0 && (
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-slate-950 shadow flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" />
                  {plant.discount}% OFF
                </span>
              )}
            </div>
          )}

          {plant.images && plant.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {plant.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition ${
                    selectedImage === idx
                      ? 'border-emerald-600 dark:border-emerald-400 ring-2 ring-emerald-200 dark:ring-emerald-950'
                      : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & CTA */}
        <div className="space-y-6">
          
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
              {plant.category} • {plant.plantType}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white pt-1">
              {plant.name}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              {plant.description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">₹{price}</span>
            {plant.discount > 0 && (
              <span className="text-sm text-slate-400 line-through">₹{plant.price}</span>
            )}
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 ml-auto flex items-center gap-1">
              <Truck className="w-4 h-4" /> Free Express Shipping
            </span>
          </div>

          {/* Botanical Specifications Cards */}
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-extrabold">Sunlight</p>
                <p className="text-slate-900 dark:text-white font-bold">{plant.sunlight}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
              <Droplets className="w-5 h-5 text-blue-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-extrabold">Watering</p>
                <p className="text-slate-900 dark:text-white font-bold">{plant.water}</p>
              </div>
            </div>
          </div>

          {/* Care Instructions */}
          {plant.careInstructions && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs space-y-1">
              <p className="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Nursery Botanist Care Advice:
              </p>
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{plant.careInstructions}</p>
            </div>
          )}

          {/* Quantity & CTA */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">Quantity:</span>
              <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-black text-slate-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => addToCart(plant, quantity)}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                Add to Cart (₹{price * quantity})
              </button>
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="flex-1 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                Buy Now
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Related Plants */}
      {relatedPlants.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Similar Nursery Recommendations</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedPlants.map((item) => (
              <PlantCard key={item._id} plant={item} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default PlantDetails;
