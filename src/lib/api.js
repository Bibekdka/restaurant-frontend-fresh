const API_URL = import.meta.env.VITE_API_URL || 'https://bckend12345.onrender.com';


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
};
