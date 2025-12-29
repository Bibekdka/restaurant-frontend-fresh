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
    getProducts: async () => {
        const response = await fetch(`${API_URL}/api/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
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
        if (!response.ok) throw new Error('Failed to create product');
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
        if (!response.ok) throw new Error('Failed to update product');
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
        if (!response.ok) throw new Error('Failed to update price');
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
        if (!response.ok) throw new Error('Failed to delete product');
        return response.json();
    },

    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Image upload failed');
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
        if (!response.ok) throw new Error('Failed to add image');
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
        if (!response.ok) throw new Error('Failed to delete image');
        return response.json();
    },

    addReview: async (productId, reviewData, token) => {
        const response = await fetch(`${API_URL}/api/products/${productId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(reviewData),
        });
        if (!response.ok) throw new Error('Failed to add review');
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
        if (!response.ok) throw new Error('Failed to create order');
        return response.json();
    },

    getOrders: async (token) => {
        const response = await fetch(`${API_URL}/api/orders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    getMyOrders: async (token) => {
        const response = await fetch(`${API_URL}/api/orders/myorders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to fetch my orders');
        return response.json();
    },

    deleteReview: async (productId, reviewId, token) => {
        const response = await fetch(`${API_URL}/api/products/${productId}/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) throw new Error('Failed to delete review');
        return response.json();
    },
};
