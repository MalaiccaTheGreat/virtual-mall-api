import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token refresh or logout
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Product API
export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

export const getProduct = async (id: number) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Cart API
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId: number, quantity: number = 1) => {
  const response = await api.post('/cart/add', {
    product_id: productId,
    quantity,
  });
  return response.data;
};

// Authentication API
export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}) => {
  const response = await api.post('/register', userData);
  return response.data;
};

export const logout = async () => {
  const response = await api.post('/logout');
  return response.data;
};

// Virtual Assistant API
interface ChatResponse {
  message: string;
  audio_url?: string;
  expression?: string;
}

export async function chatWithAssistant(
  message: string
): Promise<ChatResponse> {
  try {
    const response = await api.post<ChatResponse>('/chat', { message });
    return response.data;
  } catch (error) {
    console.error('Error in chatWithAssistant:', error);
    throw error;
  }
}

export default api;
