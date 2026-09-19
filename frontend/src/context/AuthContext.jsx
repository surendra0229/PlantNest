import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, adminService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  // Check User authentication status via HttpOnly cookie
  const checkUserAuth = async () => {
    try {
      setLoadingUser(true);
      const data = await authService.getProfile();
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  // Check Admin authentication status via HttpOnly cookie
  const checkAdminAuth = async () => {
    try {
      setLoadingAdmin(true);
      const data = await adminService.getProfile();
      if (data.success && data.admin) {
        setAdmin(data.admin);
      } else {
        setAdmin(null);
      }
    } catch (err) {
      setAdmin(null);
    } finally {
      setLoadingAdmin(false);
    }
  };

  useEffect(() => {
    checkUserAuth();
    checkAdminAuth();
  }, []);

  const loginUser = async (credentials) => {
    const data = await authService.login(credentials);
    if (data.success && data.user) {
      setUser(data.user);
    }
    return data;
  };

  const registerUser = async (userData) => {
    const data = await authService.register(userData);
    return data;
  };

  const logoutUser = async () => {
    try {
      await authService.logout();
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
    }
  };

  const loginAdmin = async (credentials) => {
    const data = await adminService.login(credentials);
    if (data.success && data.admin) {
      setAdmin(data.admin);
    }
    return data;
  };

  const logoutAdmin = async () => {
    try {
      await adminService.logout();
    } catch (e) {
      // ignore
    } finally {
      setAdmin(null);
    }
  };

  const updateAddressesInState = (addresses) => {
    if (user) {
      setUser({ ...user, addresses });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        admin,
        loadingUser,
        loadingAdmin,
        loginUser,
        registerUser,
        logoutUser,
        loginAdmin,
        logoutAdmin,
        checkUserAuth,
        checkAdminAuth,
        updateAddressesInState
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
