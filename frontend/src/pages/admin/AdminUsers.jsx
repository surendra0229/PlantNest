import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import AdminLayout from '../../components/layout/AdminLayout';
import { Users, Mail, Phone, ShoppingBag, ShieldCheck, Loader2, IndianRupee, Calendar } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await adminService.getUsers();
        if (res.success) setUsers(res.users);
      } catch (err) {
        toast.error('Failed to load user directory.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <AdminLayout>
      {/* Header Info */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Registered Customer Directory
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Detailed directory of customer accounts, registration dates, order counts, and lifetime purchase value in ₹.
        </p>
      </div>

      {/* Users Table */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-extrabold uppercase tracking-wider">
              <tr>
                <th className="p-4">Customer Name</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Phone Number</th>
                <th className="p-4">Registration Date</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Lifetime Spent (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center text-slate-500">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-emerald-600 mb-2" />
                    Loading user directory...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-400">
                    No registered customers found.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shadow-sm">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-extrabold text-slate-900 dark:text-white">{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="p-4 font-mono">{u.phone || 'N/A'}</td>
                    <td className="p-4 text-slate-500 font-semibold">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 font-bold text-emerald-700 dark:text-emerald-400">
                      {u.orderCount} orders
                    </td>
                    <td className="p-4 font-mono font-black text-emerald-700 dark:text-emerald-400">
                      ₹{u.totalSpent?.toLocaleString('en-IN') || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
