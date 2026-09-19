import React, { useState } from 'react';
import AdminNavbar from './AdminNavbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 flex flex-col">
      {/* Sticky Admin Navbar Header */}
      <AdminNavbar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Container Body */}
      <div className="flex flex-1 relative">
        {/* Fixed Desktop Sidebar (w-16 collapsed, w-72 on hover) & Mobile Overlay Drawer */}
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Area - Offset by Fixed Sidebar Collapsed Width (md:pl-24 lg:pl-28) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 md:pl-24 lg:pl-28 min-h-[calc(100vh-65px)] overflow-y-auto bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
          <div className="w-full max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
