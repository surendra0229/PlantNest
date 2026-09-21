import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService, orderService } from '../services/api';
import { User, MapPin, PackageCheck, Plus, Trash2, ShieldCheck, Phone, Mail } from 'lucide-react';

const Profile = () => {
  const { user, updateAddressesInState } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);

  const [newAddr, setNewAddr] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        const res = await orderService.getMyOrders();
        if (res.success) setOrders(res.orders);
      } catch (err) {
        console.error('Error fetching user orders:', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleAddAddressSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.addAddress(newAddr);
      if (res.success) {
        toast.success('Shipping address added.');
        updateAddressesInState(res.addresses);
        setShowAddAddressModal(false);
        setNewAddr({
          fullName: user?.name || '',
          phone: user?.phone || '',
          street: '',
          city: '',
          state: '',
          postalCode: '',
          country: 'United States',
          isDefault: false
        });
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await authService.deleteAddress(id);
      if (res.success) {
        toast.success('Address removed.');
        updateAddressesInState(res.addresses);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete address');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-slate-900 dark:text-slate-100">
      
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">User Profile & Account Privacy</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
          Manage your personal details, saved shipping addresses, and order history securely.
        </p>
      </div>

      {/* 1. Personal Information Section */}
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white font-black text-2xl flex items-center justify-center shadow-lg overflow-hidden shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase()
            )}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              {user?.name}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {user?.email}
            </p>
            {user?.phone && (
              <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {user.phone}
              </p>
            )}
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Customer Account Status: Active</span>
        </div>
      </div>

      {/* 2. Addresses Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Saved Delivery Addresses
          </h2>
          <button
            onClick={() => setShowAddAddressModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold flex items-center gap-1.5 shadow transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add New Address
          </button>
        </div>

        {user?.addresses && user.addresses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.addresses.map((addr) => (
              <div key={addr._id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl relative space-y-2 border border-slate-200 dark:border-slate-800 shadow-sm">
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                    Default Address
                  </span>
                )}
                <p className="font-extrabold text-sm text-slate-900 dark:text-white">{addr.fullName}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{addr.street}, {addr.city}</p>
                <p className="text-xs text-slate-500 dark:text-slate-500 font-medium">{addr.state} {addr.postalCode}, {addr.country}</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold pt-1">Phone: {addr.phone}</p>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={() => handleDeleteAddress(addr._id)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Address
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 font-semibold">
            No shipping addresses saved yet. Click "Add New Address" above to save one for faster checkout.
          </div>
        )}
      </div>

      {/* 3. Order History Section */}
      <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          My Orders & Order History
        </h2>

        {loadingOrders ? (
          <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400 font-bold animate-pulse">
            Loading order history...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl text-center text-xs text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 space-y-3 font-semibold">
            <p>You have not placed any orders yet.</p>
            <Link to="/dashboard" className="inline-block px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow transition">
              Explore Plants Feed
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-3 sm:p-4">Order ID</th>
                    <th className="p-3 sm:p-4">Date</th>
                    <th className="p-3 sm:p-4">Total Amount</th>
                    <th className="p-3 sm:p-4">Status</th>
                    <th className="p-3 sm:p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                  {orders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60 transition">
                      <td className="p-3 sm:p-4 font-mono font-bold text-emerald-700 dark:text-emerald-400">#{ord._id.slice(-8)}</td>
                      <td className="p-3 sm:p-4 font-medium">{new Date(ord.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 sm:p-4 font-black text-slate-900 dark:text-white">₹{ord.totalAmount}</td>
                      <td className="p-3 sm:p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="p-3 sm:p-4 text-right">
                        <Link
                          to={`/orders/${ord._id}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 font-extrabold text-xs transition"
                        >
                          Track Order
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Address Modal */}
      {showAddAddressModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-2xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Add Shipping Address</h3>
            <form onSubmit={handleAddAddressSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-semibold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-semibold"
                />
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">Street</label>
                <input
                  type="text"
                  required
                  value={newAddr.street}
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-semibold"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newAddr.state}
                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-700 dark:text-slate-300 font-extrabold block mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={newAddr.postalCode}
                  onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl p-2.5 font-semibold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddAddressModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold shadow"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
