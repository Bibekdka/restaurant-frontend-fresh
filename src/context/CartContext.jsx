import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    // Initialize cart from localStorage
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error('Failed to load cart from storage', error);
            return [];
        }
    });

    // Helper to update both state and localStorage
    const updateCart = (newCart) => {
        setCart(newCart);
        localStorage.setItem('cart', JSON.stringify(newCart));
    };

    const addToCart = (food, qty = 1) => {
        const itemQty = Number(qty);
        let newCart;
        const existItem = cart.find(x => x.product === food._id);

        if (existItem) {
            newCart = cart.map(x =>
                x.product === food._id ? { ...existItem, qty: existItem.qty + itemQty } : x
            );
        } else {
            newCart = [...cart, { ...food, product: food._id, qty: itemQty }];
        }
        updateCart(newCart);
    };

    const removeFromCart = (productId) => {
        const newCart = cart.filter(x => x.product !== productId);
        updateCart(newCart);
    };

    const updateQuantity = (productId, qty) => {
        const itemQty = Number(qty);
        if (itemQty <= 0) {
            removeFromCart(productId);
        } else {
            const newCart = cart.map(x =>
                x.product === productId ? { ...x, qty: itemQty } : x
            );
            updateCart(newCart);
        }
    };

    const clearCart = () => {
        updateCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};
