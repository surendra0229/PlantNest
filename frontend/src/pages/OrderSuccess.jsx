import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/api';
import {
  CheckCircle2,
  Package,
  ArrowRight,
  MapPin,
  CreditCard,
  Calendar,
  Loader2,
  ShoppingBag,
  Truck,
  ShieldCheck
} from 'lucide-react';

const OrderSuccess = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderService.getOrderById(id);
        if (res.success) {
          setOrder(res.order);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  // Expected Delivery Date helper (3 business days from order creation)
  const getExpectedDeliveryDate = (createdAt) => {
    const d = createdAt ? new Date(createdAt) : new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="max-w-3xl mx-auto my-12 px-4 space-y-8 text-slate-900 dark:text-slate-100">
      
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-slate-900 p-8 sm:p-10 rounded-3xl text-center space-y-5 border border-emerald-300 dark:border-emerald-800 shadow-xl">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center animate-bounce shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 uppercase tracking-wider">
            Order Successfully Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white pt-1">
            Thank You for Your Purchase!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto font-medium">
            Your nursery order has been placed successfully. Live plants are being carefully prepared for express delivery.
          </p>
        </div>

        {/* Order Reference Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono flex items-center justify-between max-w-md mx-auto">
          <span className="text-slate-500 font-bold">Order Reference ID:</span>
          <span className="font-black text-emerald-700 dark:text-emerald-400">#{id?.slice(-8) || id}</span>
        </div>
      </div>

      {/* Detailed Order Breakdown Card */}
      {loading ? (
        <div className="p-12 text-center text-xs font-bold text-slate-500 flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
          Loading order details...
        </div>
      ) : order ? (
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          
          <h2 className="text-lg font-black text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Purchased Nursery Items ({order.orderItems?.length || 0})
          </h2>

          {/* Purchased Items List */}
          <div className="space-y-3 divide-y divide-slate-100 dark:divide-slate-800">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                    />
                  )}
                  <div>
                    <p className="font-extrabold text-xs text-slate-900 dark:text-white">{item.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-black text-xs text-emerald-700 dark:text-emerald-400">
                  ₹{item.finalPrice * item.quantity}
                </span>
              </div>
            ))}
          </div>

          {/* Delivery & Payment Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            
            {/* Delivery Address */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
              <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Shipping Destination:
              </p>
              <p className="font-bold text-slate-800 dark:text-slate-200">{order.shippingAddress?.fullName}</p>
              <p className="text-slate-600 dark:text-slate-400">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
              <p className="text-slate-500 dark:text-slate-500">{order.shippingAddress?.state} - {order.shippingAddress?.postalCode}</p>
              <p className="text-emerald-700 dark:text-emerald-400 font-semibold pt-0.5">📞 {order.shippingAddress?.phone}</p>
            </div>

            {/* Payment & Delivery Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
              <div>
                <p className="font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5 mb-1">
                  <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Payment Summary:
                </p>
                <div className="flex justify-between font-medium">
                  <span>Method:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Status:</span>
                  <span className={`font-extrabold ${order.paymentStatus === 'Paid' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between font-black text-sm pt-1.5 border-t border-slate-200 dark:border-slate-700 mt-1">
                  <span>Total Paid:</span>
                  <span className="text-emerald-700 dark:text-emerald-400">₹{order.totalAmount}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-600 dark:text-slate-300 font-semibold flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Expected Delivery: <strong>{getExpectedDeliveryDate(order.createdAt)}</strong></span>
              </div>
            </div>

          </div>

        </div>
      ) : null}

      {/* Action Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Link
          to={`/orders`}
          className="flex-1 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Package className="w-4 h-4" />
          View All Orders & Tracking
        </Link>
        <Link
          to="/dashboard"
          className="flex-1 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-400 font-extrabold text-xs shadow-sm flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <span>Continue Shopping Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};

export default OrderSuccess;
