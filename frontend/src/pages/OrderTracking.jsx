import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/api';
import { useToast } from '../context/ToastContext';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  MapPin,
  CreditCard,
  AlertOctagon,
  ArrowLeft
} from 'lucide-react';

const OrderTracking = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [order, setOrder] = useState(null);
  const [ordersList, setOrdersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true);
        if (id) {
          const res = await orderService.getOrderById(id);
          if (res.success) setOrder(res.order);
        } else {
          const res = await orderService.getMyOrders();
          if (res.success) {
            setOrdersList(res.orders);
            if (res.orders.length > 0) setOrder(res.orders[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderData();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      setCancelling(true);
      const res = await orderService.cancelOrder(order._id);
      if (res.success) {
        toast.success('Order cancelled successfully.');
        setOrder(res.order);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const steps = [
    { title: 'Order Placed', statusKey: 'Pending', icon: Clock },
    { title: 'Processing', statusKey: 'Processing', icon: Package },
    { title: 'Dispatched / Shipped', statusKey: 'Shipped', icon: Truck },
    { title: 'Delivered', statusKey: 'Delivered', icon: CheckCircle2 },
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto my-20 p-12 text-center text-slate-500 dark:text-slate-400 font-bold animate-pulse">
        Loading order details...
      </div>
    );
  }

  if (!order && ordersList.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center space-y-4 shadow-xl text-slate-900 dark:text-white">
        <h2 className="text-xl font-black">No Orders Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
          You haven't placed any orders yet.
        </p>
        <Link to="/dashboard" className="inline-block px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-extrabold text-xs shadow">
          Explore Plants Feed
        </Link>
      </div>
    );
  }

  const currentStep = getStepIndex(order?.orderStatus);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-slate-900 dark:text-slate-100">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Track Order</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Real-time status updates from our nursery fulfillment team.
          </p>
        </div>
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs shadow-sm hover:text-emerald-700"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Back to Profile
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Main Status Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Order ID</p>
                <p className="font-mono font-black text-lg text-slate-900 dark:text-white">#{order._id}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  order.orderStatus === 'Cancelled'
                    ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                }`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Stepper Indicator */}
            {order.orderStatus !== 'Cancelled' ? (
              <div className="py-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-2 text-center">
                  {steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isCompleted = currentStep >= idx;
                    return (
                      <div key={step.title} className="flex flex-col items-center gap-2 p-2 rounded-2xl bg-slate-50 dark:bg-slate-800/60 sm:bg-transparent sm:dark:bg-transparent border border-slate-200/60 dark:border-slate-700/60 sm:border-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition ${
                          isCompleted
                            ? 'bg-emerald-700 dark:bg-emerald-600 text-white shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                        }`}>
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <span className={`text-[11px] font-extrabold ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                          {step.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 font-bold flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>This order was cancelled on request.</span>
              </div>
            )}

            {/* Timeline Notes */}
            {order.trackingTimeline && order.trackingTimeline.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Tracking Notes</h3>
                <div className="space-y-2">
                  {order.trackingTimeline.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-0.5">
                      <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                        <span>{item.status}</span>
                        <span className="text-[10px] text-slate-400">{new Date(item.date).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 font-medium">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Summary */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-black text-lg text-slate-900 dark:text-white pb-3 border-b border-slate-100 dark:border-slate-800">
            Order Items & Address
          </h3>

          {/* Shipping Address */}
          <div className="space-y-1 text-xs">
            <p className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Delivery Address:
            </p>
            <p className="text-slate-700 dark:text-slate-300 font-bold">{order.shippingAddress?.fullName}</p>
            <p className="text-slate-500 dark:text-slate-400">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
            <p className="text-slate-500 dark:text-slate-400">{order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
          </div>

          {/* Items */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 text-xs">
                <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                  <p className="text-slate-500 dark:text-slate-400">Qty: {item.quantity}</p>
                </div>
                <span className="font-black text-slate-900 dark:text-white">${item.finalPrice * item.quantity}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline text-xs">
            <span className="font-bold text-slate-700 dark:text-slate-300">Total Paid:</span>
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">${order.totalAmount}</span>
          </div>

          {order.orderStatus === 'Pending' && (
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow transition cursor-pointer"
            >
              {cancelling ? 'Cancelling Order...' : 'Cancel Order'}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

export default OrderTracking;
