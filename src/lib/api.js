const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

console.log('Using API URL:', API_URL);

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
        const response = await fetch(`${API_URL}/api/products?page=${page}&limit=${limit}`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        // Return paginated data structure, but also support legacy code expecting array
        return data.products ? data : { products: data };
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
        const response = await fetch(`${API_URL}/api/orders/myorders?page=${page}&limit=${limit}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error((await response.json()).message || 'Failed to fetch my orders');
        const data = await response.json();
        return data.orders ? data : { orders: data };
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
