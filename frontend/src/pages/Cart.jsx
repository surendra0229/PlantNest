import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ShoppingBag, Trash2, ArrowRight, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  const freeShippingThreshold = 499;
  const shippingCost = cartTotal >= freeShippingThreshold ? 0 : 49;
  const grandTotal = cartTotal + shippingCost;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-16 px-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 rounded-3xl text-center space-y-6 shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/60 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Your Cart is Empty</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-semibold">
              You have not added any botanical plants to your cart yet. Explore our nursery catalog to find your green companions!
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-lg transition"
          >
            Browse Plant Nursery
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-900 dark:text-slate-100">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Shopping Cart</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Review your plant selections and check out safely.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
          Clear Cart
        </button>
      </div>

      {/* Free Shipping Banner */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 shadow-sm">
        <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 shrink-0">
          <Truck className="w-6 h-6" />
        </div>
        <div className="flex-1">
          {amountToFreeShipping > 0 ? (
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Add <span className="text-emerald-700 dark:text-emerald-400 font-black">₹{amountToFreeShipping}</span> more to unlock <strong className="text-slate-900 dark:text-white">FREE Express Shipping!</strong>
              </p>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 dark:bg-emerald-400 transition-all duration-500"
                  style={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
              🎉 Congratulations! You have unlocked <strong className="text-slate-900 dark:text-white">FREE Express Delivery!</strong>
            </p>
          )}
        </div>
      </div>

      {/* Cart Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Cart Item List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => {
            const plant = item.plant;
            const price = plant.finalPrice || plant.price;
            const itemTotal = price * item.quantity;
            const image = plant.images?.[0] || null;

            return (
              <div
                key={plant._id}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  {image && (
                    <img
                      src={image}
                      alt={plant.name}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  )}
                  <div>
                    <Link to={`/plant/${plant._id}`} className="font-extrabold text-sm text-slate-900 dark:text-white hover:text-emerald-700 dark:hover:text-emerald-400 transition">
                      {plant.name}
                    </Link>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold">{plant.category}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-bold mt-1">₹{price} each</p>
                  </div>
                </div>

                {/* Quantity & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100 dark:border-slate-800">
                  
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 p-1">
                    <button
                      onClick={() => updateQuantity(plant._id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(plant._id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center font-bold text-xs cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <span className="text-sm font-black text-slate-900 dark:text-white min-w-[70px] text-right">
                    ₹{itemTotal}
                  </span>

                  <button
                    onClick={() => removeFromCart(plant._id)}
                    className="text-slate-400 hover:text-rose-600 p-1.5 transition cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>
              </div>
            );
          })}

          <div className="pt-4">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl space-y-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-black text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs font-semibold text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-extrabold text-slate-900 dark:text-white">₹{cartTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
                {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
              </span>
            </div>
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Grand Total</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white">₹{grandTotal}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>30-Day Plant Guarantee & Encrypted Checkout</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Cart;
