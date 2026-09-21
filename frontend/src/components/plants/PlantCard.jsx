import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ShoppingBag, Sun, Droplets, Tag, Star, Truck, Zap } from 'lucide-react';

const PlantCard = ({ plant }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const isLowStock = plant.stock > 0 && plant.stock <= 5;
  const isOutOfStock = plant.stock <= 0 || !plant.isAvailable;
  const imageSrc = plant.images?.[0] || null;
  
  const ratingScore = plant.ratings?.average || (4.5 + (plant._id ? plant._id.charCodeAt(plant._id.length - 1) % 5 : 3) * 0.1).toFixed(1);
  const ratingCount = plant.ratings?.count || (24 + (plant._id ? plant._id.charCodeAt(0) % 90 : 40));

  const handleBuyNow = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    navigate('/checkout', {
      state: {
        buyNowItem: {
          plant,
          quantity: 1
        }
      }
    });
  };

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-400 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
      <div>
        
        {/* Plant Image Container */}
        {imageSrc ? (
          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800 p-3">
            <img
              src={imageSrc}
              alt={plant.name}
              className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />

            {/* Plant Type Badge */}
            <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-white/95 dark:bg-slate-900/90 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 shadow-sm backdrop-blur-md">
              {plant.plantType || 'Indoor'}
            </span>

            {/* Discount Badge */}
            {plant.discount > 0 && (
              <span className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500 text-slate-900 shadow-md flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {plant.discount}% OFF
              </span>
            )}

            {/* Low Stock / Out of Stock Banner */}
            {isOutOfStock ? (
              <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px] flex items-center justify-center">
                <span className="px-3 py-1.5 rounded-xl bg-rose-600 text-white text-xs font-bold uppercase tracking-wider shadow">
                  Sold Out
                </span>
              </div>
            ) : isLowStock ? (
              <span className="absolute bottom-4 left-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 shadow-sm">
                Only {plant.stock} Left!
              </span>
            ) : null}
          </div>
        ) : (
          <div className="p-4 pt-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80 shadow-sm">
              {plant.plantType || 'Indoor'}
            </span>
            {plant.discount > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-500 text-slate-900 shadow-md flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {plant.discount}% OFF
              </span>
            )}
          </div>
        )}

        {/* Plant Details */}
        <div className="p-4 space-y-2">
          
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 dark:text-emerald-400 gap-2 min-w-0">
            <span className="truncate uppercase tracking-wider min-w-0">{plant.category}</span>
            
            {/* Rating Badge */}
            <div className="flex items-center gap-1 bg-emerald-700 dark:bg-emerald-600 text-white font-black text-[11px] px-2 py-0.5 rounded-md shadow-sm">
              <span>{ratingScore}</span>
              <Star className="w-3 h-3 fill-white text-white" />
              <span className="text-[9px] opacity-90">({ratingCount})</span>
            </div>
          </div>

          <Link to={`/plant/${plant._id}`} className="block group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:underline">
              {plant.name}
            </h3>
          </Link>

          {/* Care Micro Indicators */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400 font-medium pt-0.5">
            <span className="flex items-center gap-1" title={`Sunlight: ${plant.sunlight}`}>
              <Sun className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate max-w-[85px]">{plant.sunlight}</span>
            </span>
            <span className="flex items-center gap-1" title={`Watering: ${plant.water}`}>
              <Droplets className="w-3.5 h-3.5 text-blue-500 shrink-0" />
              <span className="truncate max-w-[85px]">{plant.water}</span>
            </span>
          </div>

          {/* Free Shipping Badge */}
          <div className="flex items-center gap-1 text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold pt-1">
            <Truck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Free Express Delivery</span>
          </div>

        </div>
      </div>

      {/* Card Footer: Price, Add to Cart & Buy Now */}
      <div className="p-4 pt-2 border-t border-slate-100 dark:border-slate-800 mt-1 space-y-2">
        <div className="flex items-baseline justify-between">
          {plant.discount > 0 ? (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="text-base font-black text-slate-900 dark:text-white">₹{plant.finalPrice}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 line-through">₹{plant.price}</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 dark:text-amber-400">{plant.discount}% Special Deal</span>
            </div>
          ) : (
            <span className="text-base font-black text-slate-900 dark:text-white">₹{plant.price}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addToCart(plant, 1)}
            disabled={isOutOfStock}
            className={`w-full py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-all ${
              isOutOfStock
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-md hover:scale-102 cursor-pointer'
            }`}
            title="Add item to shopping cart"
          >
            <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add'}</span>
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isOutOfStock}
            className={`w-full py-2 px-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-1 transition-all ${
              isOutOfStock
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md hover:scale-102 cursor-pointer'
            }`}
            title="Buy Now immediately"
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950 shrink-0" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantCard;
