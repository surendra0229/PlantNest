export const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.startsWith('http')) {
    return envUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
  }
  return 'https://plantnest-rcp4.onrender.com';
};

const API_BASE = (import.meta.env.VITE_API_URL || 'https://plantnest-rcp4.onrender.com/api').replace(/\/$/, '');

export const apiCall = async (endpoint, method = 'GET', data = null) => {
  const token = localStorage.getItem('plantnest_admin_token') ||
                localStorage.getItem('adminToken') ||
                localStorage.getItem('plantnest_token') ||
                localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
    credentials: 'include', // Send and receive HttpOnly cookies when allowed
  };

  if (data && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'API request failed');
  }

  return result;
};

// User Auth Services
export const authService = {
  register: (userData) => apiCall('/auth/register', 'POST', userData),
  login: (credentials) => apiCall('/auth/login', 'POST', credentials),
  logout: () => apiCall('/auth/logout', 'POST'),
  getProfile: () => apiCall('/auth/me', 'GET'),
  updateProfile: (data) => apiCall('/auth/profile', 'PUT', data),
  addAddress: (addressData) => apiCall('/auth/addresses', 'POST', addressData),
  deleteAddress: (id) => apiCall(`/auth/addresses/${id}`, 'DELETE'),
};

// Admin Auth & Services
export const adminService = {
  login: (credentials) => apiCall('/admin/auth/login', 'POST', credentials),
  logout: () => apiCall('/admin/auth/logout', 'POST'),
  getProfile: () => apiCall('/admin/auth/me', 'GET'),
  getAnalytics: () => apiCall('/admin/analytics', 'GET'),
  getUsers: () => apiCall('/admin/users', 'GET'),
};

// Plant Services with Cloudinary File Uploads
export const plantService = {
  getPlants: (params = {}) => {
    const query = new URLSearchParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
        query.append(key, params[key]);
      }
    });
    return apiCall(`/plants?${query.toString()}`, 'GET');
  },
  getPlantById: (id) => apiCall(`/plants/${id}`, 'GET'),
  getCategories: () => apiCall('/plants/categories', 'GET'),
  uploadImage: async (fileOrBase64) => {
    // Helper: read a File/Blob as a base64 data URL using FileReader
    const readAsBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);   // result = "data:image/jpeg;base64,..."
        reader.onerror = () => reject(new Error('Failed to read image file.'));
        reader.readAsDataURL(file);
      });

    let imageData = fileOrBase64;

    // If a File or Blob is passed, convert it to a base64 data URL
    if (typeof File !== 'undefined' && (fileOrBase64 instanceof File || fileOrBase64 instanceof Blob)) {
      imageData = await readAsBase64(fileOrBase64);
    }

    // Send as a plain JSON body through the Vite proxy — no multipart, no CORS issues
    // Backend receives req.body.image as "data:image/jpeg;base64,..." and uploads to Cloudinary
    return apiCall('/upload', 'POST', { image: imageData });
  },
  deleteImage: (publicIdOrUrl) => apiCall('/upload', 'DELETE', { url: publicIdOrUrl }),
  createPlant: (data) => apiCall('/plants', 'POST', data),
  updatePlant: (id, data) => apiCall(`/plants/${id}`, 'PUT', data),
  deletePlant: (id) => apiCall(`/plants/${id}`, 'DELETE'),
};

// Order Services
export const orderService = {
  createOrder: (orderData) => apiCall('/orders', 'POST', orderData),
  createRazorpayOrder: (orderData) => apiCall('/orders/razorpay/create-order', 'POST', orderData),
  verifyRazorpayPayment: (paymentData) => apiCall('/orders/razorpay/verify-payment', 'POST', paymentData),
  getMyOrders: () => apiCall('/orders/my-orders', 'GET'),
  getOrderById: (id) => apiCall(`/orders/${id}`, 'GET'),
  cancelOrder: (id) => apiCall(`/orders/${id}/cancel`, 'PUT'),
  getAllOrders: (status = 'All') => apiCall(`/orders${status !== 'All' ? `?status=${status}` : ''}`, 'GET'),
  updateOrderStatus: (id, statusData) => apiCall(`/orders/${id}/status`, 'PUT', statusData),
};

// RAG Chatbot Service
export const chatbotService = {
  query: (queryText) => apiCall('/chatbot/query', 'POST', { query: queryText }),
};

// Admin Knowledge Base Service
export const knowledgeService = {
  getAll: () => apiCall('/admin/knowledge', 'GET'),
  create: (data) => apiCall('/admin/knowledge', 'POST', data),
  update: (id, data) => apiCall(`/admin/knowledge/${id}`, 'PUT', data),
  delete: (id) => apiCall(`/admin/knowledge/${id}`, 'DELETE'),
};
