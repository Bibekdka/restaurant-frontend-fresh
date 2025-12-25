import { useState, useEffect } from "react";
import { LogOut, User, PlusCircle } from "lucide-react";
import { api } from "./lib/api";
import Login from "./components/Login";
import FoodCard from "./components/FoodCard";
import FoodModal from "./components/FoodModal";

export default function App() {
  const [user, setUser] = useState(null);
  const [foods, setFoods] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const [sortType, setSortType] = useState("rating"); // "rating" | "price_asc" | "price_desc"

  useEffect(() => {
    // Check local storage for user
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) {
      setUser(JSON.parse(userStr));
    }
    setLoading(false);
  }, []);

  // Setup data fetching
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        setLoading(true);
        // Using the fake data seed check or real API
        // Using the fake data seed check or real API
        const data = await api.getProducts();

        // Handle the response directly since api.getProducts converts to json
        if (data) {
          const mappedData = data.map(item => ({ ...item, id: item._id }));
          setFoods(mappedData);
          setLoading(false); // Ensure loading is set false on success
          return;
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

  const seedFoods = async () => {
    // Check if foods already exist to avoid duplicates if desired
    // For now we will just add more.

    const dummyReviews = [
      { id: 1, rating: 5, comment: "Absolutely delicious! Will order again.", createdAt: new Date().toISOString() },
      { id: 2, rating: 4, comment: "Great taste but arrived a bit cold.", createdAt: new Date(Date.now() - 86400000).toISOString() },
      { id: 3, rating: 5, comment: "Best I've ever had.", createdAt: new Date(Date.now() - 172800000).toISOString() }
    ];

    const dummyFoods = [
      {
        name: "Classic Burger",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60",
        rating: 4.5,
        reviews: dummyReviews,
        created_at: new Date().toISOString()
      },
      {
        name: "Margherita Pizza",
        price: 14.50,
        image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=60",
        rating: 4.8,
        reviews: [
          { id: 1, rating: 5, comment: "Perfect crust!", createdAt: new Date().toISOString() }
        ],
        created_at: new Date().toISOString()
      },
      {
        name: "Sushi Platter",
        price: 24.00,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=500&q=60",
        rating: 4.9,
        reviews: [],
        created_at: new Date().toISOString()
      },
      {
        name: "Pasta Carbonara",
        price: 16.00,
        image: "https://images.unsplash.com/photo-1612874742237-9828671438a3?auto=format&fit=crop&w=500&q=60",
        rating: 4.2,
        reviews: [
          { id: 1, rating: 4, comment: "Creamy and rich.", createdAt: new Date().toISOString() },
          { id: 2, rating: 3, comment: "A bit too salty for me.", createdAt: new Date().toISOString() }
        ],
        created_at: new Date().toISOString()
      }
    ];

    try {
      setLoading(true);
      for (const food of dummyFoods) {
        await addDoc(collection(db, "foods"), food);
      }
      alert("Sample data added successfully!");
    } catch (e) {
      alert("Error seeding data: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelected(null);
  };

  if (loading) return <div className="container" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>Loading...</div>;

  if (!user) return <Login />;

  return (
    <div className="container">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ fontSize: '1.5rem', background: 'linear-gradient(to right, #FF4757, #FF6B81)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Fine Dining
          </h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-card)', color: 'var(--text-main)' }}
          >
            <option value="rating">Top Rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} />
            </div>
            {user.email}
          </span>
          <button onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }} style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Sign Out <LogOut size={14} />
          </button>
        </div>
      </header>

      <div className="grid">
        {foods.length === 0 ? (
          <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '40px' }}>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>No foods found. Start by adding sample data.</p>
            <button onClick={seedFoods} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={20} /> Add Sample Menu
            </button>
          </div>
        ) : (
          sortedFoods.map(f => (
            <FoodCard key={f.id} food={f} onClick={() => setSelected(f)} />
          ))
        )}
      </div>

      {selected && <FoodModal food={selected} onClose={handleCloseModal} />}
    </div>
  );
}

