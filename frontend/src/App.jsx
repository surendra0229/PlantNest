import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingNavbar from './components/layout/LandingNavbar';
import LandingFooter from './components/layout/LandingFooter';
import SidebarNav from './components/layout/SidebarNav';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import GuestRoute from './components/GuestRoute';
import ChatbotWidget from './components/chatbot/ChatbotWidget';

// User Pages
import LandingPage from './pages/LandingPage';
import UserDashboard from './pages/UserDashboard';
import PlantDetails from './pages/PlantDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Services from './pages/Services';
import Contact from './pages/Contact';

// Admin Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminPlants from './pages/admin/AdminPlants';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminKnowledge from './pages/admin/AdminKnowledge';

// Layout wrapper to conditionally manage Headers, Footers, and User Journey
const MainLayout = () => {
  const { user, admin } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthPath = location.pathname === '/login' || location.pathname === '/register';
  const showSidebar = !isAdminPath && !isAuthPath && user;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      
      {/* 
        Header rendering rules:
        - If Admin path or Auth path (/login, /register): Do NOT render any top navigation header.
        - If logged in user: Render the clean Navbar.
        - If unauthenticated visitor: Render LandingNavbar.
      */}
      {!isAdminPath && !isAuthPath && (
        user ? <Navbar /> : <LandingNavbar />
      )}

      {/* Left PlantsHub-Style Hover-Expandable Vertical Icon Sidebar */}
      {showSidebar && <SidebarNav />}

      <main className={`flex-1 ${showSidebar ? 'md:pl-16' : ''}`}>
        <Routes>
          {/* Landing / Marketing / Auth Routes */}
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : admin ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <LandingPage />
              )
            }
          />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/admin/login" element={<GuestRoute><AdminLogin /></GuestRoute>} />

          {/* Authenticated User Dashboard & Shopping Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          {/* Backward compatibility route for /shop */}
          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/plant/:id"
            element={
              <ProtectedRoute>
                <PlantDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-success/:id"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderTracking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/plants"
            element={
              <AdminRoute>
                <AdminPlants />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/knowledge"
            element={
              <AdminRoute>
                <AdminKnowledge />
              </AdminRoute>
            }
          />
          {/* Wildcard Catch-All Route for unauthorized/unknown URLs */}
          <Route
            path="*"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : admin ? (
                <Navigate to="/admin/dashboard" replace />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </main>

      {/* RAG Chatbot Assistant Widget available on user pages */}
      {!isAdminPath && <ChatbotWidget />}

      {/* 
        Footer rendering rules:
        - If Admin path or Auth path (/login, /register) or logged in user: Do NOT render footers on dashboard.
        - If unauthenticated visitor: Render LandingFooter on landing pages.
      */}
      {!isAdminPath && !isAuthPath && !user && (
        <LandingFooter />
      )}
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <SidebarProvider>
              <Router>
                <MainLayout />
              </Router>
            </SidebarProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
