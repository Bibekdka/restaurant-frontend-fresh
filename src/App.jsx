import { useState, useEffect } from "react";
import { LogOut, User, PlusCircle, ShoppingCart, List, ClipboardList } from "lucide-react";
import { api } from "./lib/api";
import { getUserRole } from "./lib/jwt";
import Login from "./components/Login";
import FoodCard from "./components/FoodCard";
import FoodModal from "./components/FoodModal";
import AddFoodModal from "./components/AddFoodModal";
import Cart from "./components/Cart";
import MyOrders from "./components/MyOrders";
import OrderList from "./components/OrderList";

export default function App() {
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editingFood, setEditingFood] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState("rating");
  const [userRole, setUserRole] = useState("user");

  // New State
  const [view, setView] = useState("menu"); // menu, cart, orders, admin-orders
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setUser(JSON.parse(userStr));
      const role = getUserRole();
      setUserRole(role);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        const data = await api.getProducts();
        if (data) {
          const mappedData = data.map(item => ({ ...item, id: item._id }));
          setFoods(mappedData);
        }
      } catch (error) {
        console.error("Error loading foods:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const sortedFoods = [...foods].sort((a, b) => {
    if (sortType === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortType === "price_asc") return a.price - b.price;
    if (sortType === "price_desc") return b.price - a.price;
    return 0;
  });

  const handleEditFood = (food) => {
    setEditingFood(food);
    setShowAddModal(true);
  };

  const handleDeleteFood = async (foodId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in to delete items");
      return;
    }

    try {
      await api.deleteProduct(foodId, token);
      setFoods(foods.filter(f => f._id !== foodId));
      alert("Item deleted successfully");
    } catch (error) {
      alert("Error deleting item: " + error.message);
    }
  };

  const handleAddToCart = (food, qty = 1) => {
    const existItem = cart.find(x => x.product === food._id);
    if (existItem) {
      setCart(cart.map(x => x.product === food._id ? { ...existItem, qty: existItem.qty + qty } : x));
    } else {
      setCart([...cart, { ...food, product: food._id, qty }]);
    }
    alert("Added to cart!");
    setSelected(null); // Close modal on add
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(x => x.product !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setView('my-orders'); // Redirect to orders after purchase
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditingFood(null);
  };

  const handleProductUpdated = () => {
    // Reload foods after edit
    const fetchFoods = async () => {
      try {
        const data = await api.getProducts();
        if (data) {
          const mappedData = data.map(item => ({ ...item, id: item._id }));
          setFoods(mappedData);
        }
      } catch (error) {
        console.error("Error reloading foods:", error);
      }
    };
    fetchFoods();
    handleCloseAddModal();
  };

  const handleCloseModal = () => {
    setSelected(null);
  };

  if (loading) return <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;

  if (!user) return <Login />;

  return (
    <div className="container">
      <header>
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => setView('menu')}
        >
          <h2 style={{ fontSize: '1.5rem', background: 'linear-gradient(to right, #FF4757, #FF6B81)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Fine Dining
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>

          {/* View Switchers */}
          <button
            onClick={() => setView('menu')}
            style={{ background: view === 'menu' ? 'var(--primary)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '5px 10px', borderRadius: '5px' }}
          >
            Menu
          </button>

          {userRole === 'admin' && (
            <button
              onClick={() => setView('admin-orders')}
              style={{ background: view === 'admin-orders' ? 'var(--primary)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '5px 10px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <ClipboardList size={16} /> Admin Orders
            </button>
          )}

          <button
            onClick={() => setView('my-orders')}
            style={{ background: view === 'my-orders' ? 'var(--primary)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '5px 10px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <List size={16} /> My Orders
          </button>

          <button
            onClick={() => setView('cart')}
            style={{ background: view === 'cart' ? 'var(--primary)' : 'transparent', border: 'none', color: 'white', cursor: 'pointer', padding: '5px 10px', borderRadius: '5px', display: 'flex', alignItems: 'center', gap: '5px', position: 'relative' }}
          >
            <ShoppingCart size={16} />
            {cart.length > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -5, background: 'red', borderRadius: '50%', width: '15px', height: '15px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{cart.reduce((a, c) => a + c.qty, 0)}</span>
            )}
          </button>


          {userRole === 'admin' && view === 'menu' && <button
            onClick={() => {
              setEditingFood(null);
              setShowAddModal(true);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'var(--primary)', color: 'white',
              padding: '8px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500', fontSize: '0.9rem'
            }}
          >
            <PlusCircle size={16} /> Add
          </button>}

          {view === 'menu' && (
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
            >
              <option value="rating">Top Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          )}

          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} />
            </div>
            {/* {user.email} */}
          </span>
          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }} style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '8px' }}>
            <LogOut size={14} />
          </button>
        </div>
      </header>

      <div className="grid">
        {view === 'menu' && (
          <>
            {foods.length === 0 ? (
              <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>No items yet. Start adding to the menu!</p>
                {userRole === 'admin' && <button onClick={() => setShowAddModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--primary)', color: 'white', padding: '12px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '500' }}>
                  <PlusCircle size={20} /> Add First Item
                </button>}
              </div>
            ) : (
              sortedFoods.map(f => (
                <FoodCard
                  key={f._id}
                  food={f}
                  onClick={() => setSelected(f)}
                  onEdit={handleEditFood}
                  onDelete={handleDeleteFood}
                  isAdmin={userRole === 'admin'}
                />
              ))
            )}
          </>
        )}

        {view === 'cart' && (
          <div style={{ gridColumn: '1/-1' }}>
            <Cart cart={cart} onRemove={removeFromCart} onClear={clearCart} />
          </div>
        )}

        {view === 'my-orders' && (
          <div style={{ gridColumn: '1/-1' }}>
            <MyOrders />
          </div>
        )}

        {view === 'admin-orders' && userRole === 'admin' && (
          <div style={{ gridColumn: '1/-1' }}>
            <OrderList />
          </div>
        )}
      </div>

      {selected && (
        <FoodModal
          food={selected}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCart}
          isAdmin={userRole === 'admin'}
        />
      )}

      {showAddModal && (
        <AddFoodModal
          product={editingFood}
          onClose={handleCloseAddModal}
          onProductUpdated={handleProductUpdated}
        />
      )}
    </div>
  );
}

