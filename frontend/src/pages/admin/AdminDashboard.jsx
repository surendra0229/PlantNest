import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, getBackendUrl } from '../../services/api';
import AdminLayout from '../../components/layout/AdminLayout';
import {
  Users,
  Sprout,
  ShoppingBag,
  CheckCircle,
  Clock,
  XCircle,
  IndianRupee,
  AlertTriangle,
  Loader2,
  ArrowRight,
  TrendingUp,
  PackageCheck
} from 'lucide-react';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const res = await adminService.getAnalytics();
        if (res.success) {
          setAnalytics(res.analytics);
        }
      } catch (err) {
        console.error('Error fetching admin analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400 animate-spin" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
            Loading nursery dashboard metrics...
          </span>
        </div>
      </AdminLayout>
    );
  }

  const {
    totalUsers = 0,
    totalPlants = 0,
    totalOrders = 0,
    completedOrders = 0,
    pendingOrders = 0,
    cancelledOrders = 0,
    totalRevenue = 0,
    lowStockCount = 0,
    lowStockPlants = [],
    recentOrders = []
  } = analytics || {};

  return (
    <AdminLayout>
      {/* Page Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Nursery Analytics Dashboard
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time operational overview of plant catalog, customer orders, revenue, and stock metrics.
          </p>
        </div>
        <Link
          to="/admin/plants"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Sprout className="w-4 h-4 text-amber-300" />
          Manage Plant Catalog
        </Link>
      </div>

      {/* Top 4 Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition hover:shadow-md">
          <div>
            <p className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Total Revenue
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1 flex items-center">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3 h-3 text-emerald-500" /> Lifetime Sales
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition hover:shadow-md">
          <div>
            <p className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Total Orders
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalOrders}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Processed Orders</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition hover:shadow-md">
          <div>
            <p className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Nursery Species
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalPlants}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Catalog Items</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 text-amber-600 dark:text-amber-400">
            <Sprout className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between transition hover:shadow-md">
          <div>
            <p className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Registered Users
            </p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {totalUsers}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Active Members</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40 text-purple-600 dark:text-purple-400">
            <Users className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Order Status Counters Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Completed / Delivered</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{completedOrders} orders</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Pending / In-Transit</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{pendingOrders} orders</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-800">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Cancelled Orders</p>
            <p className="text-xl font-black text-slate-900 dark:text-white">{cancelledOrders} orders</p>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Low Stock Warning Card */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Low Stock Plant Inventory ({lowStockCount})
            </h3>
            <Link to="/admin/plants" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold">
              Update Stock
            </Link>
          </div>

          {lowStockPlants.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              All plants in nursery catalog have sufficient stock.
            </p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {lowStockPlants.map((plant) => (
                <div
                  key={plant._id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div className="flex items-center gap-3">
                    {plant.images?.[0] && (
                      <img
                        src={plant.images[0].startsWith('http') || plant.images[0].startsWith('/') ? plant.images[0] : `${getBackendUrl()}${plant.images[0]}`}
                        alt=""
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                      />
                    )}
                    <div>
                      <p className="font-extrabold text-slate-900 dark:text-white">{plant.name}</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">{plant.category}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                    {plant.stock} left in stock
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Customer Orders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Recent Customer Orders
            </h3>
            <Link to="/admin/orders" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-bold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-slate-500 dark:text-slate-400">No recent orders recorded.</p>
            ) : (
              recentOrders.map((ord) => (
                <div
                  key={ord._id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs"
                >
                  <div>
                    <p className="font-mono font-bold text-slate-900 dark:text-white">
                      #{ord._id.slice(-8)}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      {ord.user?.name || 'Customer'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-700 dark:text-emerald-400">
                      ₹{ord.totalAmount?.toLocaleString('en-IN')}
                    </p>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      ord.orderStatus === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                    }`}>
                      {ord.orderStatus}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
