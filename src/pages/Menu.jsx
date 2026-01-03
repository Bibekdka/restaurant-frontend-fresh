import { useState, useEffect } from "react";
import { api } from "../lib/api";
import FoodCard from "../components/FoodCard";
import FoodModal from "../components/FoodModal";
import AddFoodModal from "../components/AddFoodModal";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { PlusCircle } from "lucide-react";

export default function Menu() {
    const { userRole, token } = useAuth();
    const { addToCart } = useCart();

    const [foods, setFoods] = useState([]);
    const [notification, setNotification] = useState(null);
    const [selected, setSelected] = useState(null);
    const [editingFood, setEditingFood] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sortType, setSortType] = useState("rating");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    useEffect(() => {
        fetchFoods();
    }, []);

    const fetchFoods = async () => {
        try {
            setLoading(true);
            const data = await api.getProducts();
            if (data && data.products) {
                setFoods(data.products.map(item => ({ ...item, id: item._id })));
            } else if (Array.isArray(data)) {
                setFoods(data.map(item => ({ ...item, id: item._id })));
            }
        } catch (error) {
            console.error("Error loading foods:", error);
        } finally {
            setLoading(false);
        }
    };

    const sortedFoods = [...foods].sort((a, b) => {
        if (sortType === "rating") return (b.rating || 0) - (a.rating || 0);
        if (sortType === "price_asc") return a.price - b.price;
        if (sortType === "price_desc") return b.price - a.price;
        return 0;
    });

    const handleDeleteFood = (foodId) => {
        if (!token) return;
        setShowDeleteConfirm(foodId);
    };

    const confirmDeleteFood = async (foodId) => {
        try {
            await api.deleteProduct(foodId, token);
            setFoods(prev => prev.filter(f => f._id !== foodId));
            setNotification({ type: 'success', message: 'Item deleted' });
        } catch (e) {
            setNotification({ type: 'error', message: e.message });
        } finally {
            setShowDeleteConfirm(null);
        }
    };

    const handleProductUpdated = () => {
        fetchFoods();
        setShowAddModal(false);
        setEditingFood(null);
    };

    if (loading) return <div className="spinner"></div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '2rem' }}>Menu</h2>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <select
                        value={sortType}
                        onChange={(e) => setSortType(e.target.value)}
                    >
                        <option value="rating">Top Rated</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                    </select>

                    {userRole === 'admin' && (
                        <button onClick={() => { setEditingFood(null); setShowAddModal(true); }} className="btn btn-primary">
                            <PlusCircle size={18} /> Add Item
                        </button>
                    )}
                </div>
            </div>

            <div className="grid">
                {foods.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>No items found.</p>
                ) : (
                    sortedFoods.map(f => (
                        <FoodCard
                            key={f._id}
                            food={f}
                            onClick={() => setSelected(f)}
                            onEdit={(food) => { setEditingFood(food); setShowAddModal(true); }}
                            onDelete={handleDeleteFood}
                            isAdmin={userRole === 'admin'}
                        />
                    ))
                )}
            </div>

            {selected && (
                <FoodModal
                    food={selected}
                    onClose={() => setSelected(null)}
                    onAddToCart={addToCart}
                    isAdmin={userRole === 'admin'}
                />
            )}

            {showDeleteConfirm && (
                <div className="modal-overlay" style={{ zIndex: 1200 }}>
                    <div className="modal-content" style={{ maxWidth: '420px', padding: '18px' }}>
                        <h3 style={{ marginTop: 0 }}>Confirm Delete</h3>
                        <p>Are you sure you want to delete this item?</p>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                            <button onClick={() => setShowDeleteConfirm(null)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'transparent', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={() => confirmDeleteFood(showDeleteConfirm)} style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: 'red', color: 'white', cursor: 'pointer' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}

            {notification && (
                <div style={{ position: 'fixed', right: 20, bottom: 20, zIndex: 1300 }}>
                    <div style={{ background: notification.type === 'error' ? '#fdd' : '#e6ffec', color: notification.type === 'error' ? '#900' : '#064', padding: '12px 16px', borderRadius: '8px', boxShadow: '0 6px 20px rgba(0,0,0,0.2)' }}>
                        {notification.message}
                    </div>
                </div>
            )}

            {showAddModal && (
                <AddFoodModal
                    product={editingFood}
                    onClose={() => setShowAddModal(false)}
                    onProductUpdated={handleProductUpdated}
                />
            )}
        </div>
    );
}
