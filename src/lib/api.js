const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('Using API URL:', API_URL);

const CACHE_TTLS = {
    products: 1000 * 60 * 5, // 5 minutes
    myOrders: 1000 * 60 * 1, // 1 minute
};

const readCache = (key, ttl) => {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (Date.now() - parsed.ts > ttl) {
            localStorage.removeItem(key);
            return null;
        }
        return parsed.value;
    } catch (e) {
        return null;
    }
};

const writeCache = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify({ ts: Date.now(), value }));
    } catch (e) {
        // ignore storage errors
    }
};

const clearCache = (key) => {
    try { localStorage.removeItem(key); } catch (e) {}
};

export const api = {
    // Auth
    register: async (userData) => {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Registration failed');
        return response.json();
    },

    login: async (credentials) => {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Login failed');
        return response.json();
    },

    // Products
    getProducts: async (page = 1, limit = 20) => {
        const cacheKey = `cache_products_page_${page}_limit_${limit}`;
        const cached = readCache(cacheKey, CACHE_TTLS.products);
        if (cached) return cached;

        const response = await fetch(`${API_URL}/api/products?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        const result = data.products ? data : { products: data };
        writeCache(cacheKey, result);
        return result;
    },

    getProductById: async (productId) => {
        const response = await fetch(`${API_URL}/api/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        return response.json();
    },

    createProduct: async (productData, token) => {
        const response = await fetch(`${API_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to create product');
        // invalidate product cache
        clearCache('cache_products_page_1_limit_20');
        return response.json();
    },

    // Update product details
    updateProduct: async (productId, updates, token) => {
        const response = await fetch(`${API_URL}/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updates),
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to update product');
        clearCache('cache_products_page_1_limit_20');
        return response.json();
    },

    // Update product price
    updateProductPrice: async (productId, price, token) => {
        const response = await fetch(`${API_URL}/api/products/${productId}/price`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ price }),
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to update price');
        return response.json();
    },

    // Delete product
    deleteProduct: async (productId, token) => {
        const response = await fetch(`${API_URL}/api/products/${productId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to delete product');
        clearCache('cache_products_page_1_limit_20');
        return response.json();
    },

    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Image upload failed');
        }
        return response.json();
    },

    // Add image to product
    addImageToProduct: async (productId, imageUrl, token) => {
        const response = await fetch(`${API_URL}/api/products/${productId}/images`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ url: imageUrl }),
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to add image');
        return response.json();
    },

    // Delete image from product
    deleteImageFromProduct: async (productId, imageIndex, token) => {
        const response = await fetch(`${API_URL}/api/products/${productId}/images/${imageIndex}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to delete image');
        return response.json();
    },

    addReview: async (productId, reviewData, token) => {
        const response = await fetch(`${API_URL}/api/products/${productId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` }),
            },
            body: JSON.stringify(reviewData),
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to add review');
        return response.json();
    },

    // Orders
    createOrder: async (orderData, token) => {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(orderData),
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to create order');
        return response.json();
    },

    getOrders: async (token, page = 1, limit = 20) => {
        const response = await fetch(`${API_URL}/api/orders?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to fetch orders');
        const data = await response.json();
        return data.orders ? data : { orders: data };
    },

    getMyOrders: async (token, page = 1, limit = 20) => {
        const cacheKey = `cache_myorders_${token}_page_${page}_limit_${limit}`;
        const cached = readCache(cacheKey, CACHE_TTLS.myOrders);
        if (cached) return cached;

        const response = await fetch(`${API_URL}/api/orders/myorders?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to fetch my orders');
        const data = await response.json();
        const result = data.orders ? data : { orders: data };
        writeCache(cacheKey, result);
        return result;
    },

    getOrderById: async (orderId, token) => {
        const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to fetch order');
        return response.json();
    },

    deleteReview: async (productId, reviewId, token) => {
        const response = await fetch(`${API_URL}/api/products/${productId}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to delete review');
        return response.json();
    },
};
