import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    const addToCart = (food, qty = 1) => {
        setCart((prev) => {
            const existItem = prev.find(x => x.product === food._id);
            if (existItem) {
                return prev.map(x =>
                    x.product === food._id ? { ...existItem, qty: existItem.qty + qty } : x
                );
            } else {
                return [...prev, { ...food, product: food._id, qty }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCart((prev) => prev.filter(x => x.product !== productId));
    };

    const updateQuantity = (productId, qty) => {
        if (qty <= 0) {
            removeFromCart(productId);
        } else {
            setCart((prev) =>
                prev.map(x =>
                    x.product === productId ? { ...x, qty } : x
                )
            );
        }
    };

    const clearCart = () => {
        setCart([]);
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
