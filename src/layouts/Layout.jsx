import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { ShoppingCart, User, LogOut, Menu as MenuIcon, ClipboardList, Home } from "lucide-react";

export default function Layout() {
    const { user, logout, userRole } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const cartCount = cart.reduce((a, c) => a + c.qty, 0);

    return (
        <div className="container">
            <header className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 20px', marginBottom: '30px' }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'linear-gradient(45deg, var(--primary), var(--primary-light))', padding: '8px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>🍽️</span>
                    </div>
                    <h2 style={{
                        fontSize: '1.5rem',
                        background: 'linear-gradient(to right, #fff, #ccc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0
                    }}>
                        Fine Dining
                    </h2>
                </Link>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link to="/" className={`btn ${location.pathname === '/' ? 'btn-primary' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'white', background: location.pathname === '/' ? 'var(--primary)' : 'transparent' }}>
                        <MenuIcon size={18} /> Menu
                    </Link>

                    {user && (
                        <Link to="/my-orders" className={`btn ${location.pathname === '/my-orders' ? 'btn-primary' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'white', background: location.pathname === '/my-orders' ? 'var(--primary)' : 'transparent' }}>
                            <ClipboardList size={18} /> My Orders
                        </Link>
                    )}

                    {userRole === 'admin' && (
                        <Link to="/admin/orders" className={`btn ${location.pathname === '/admin/orders' ? 'btn-primary' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: 'white', background: location.pathname === '/admin/orders' ? 'var(--primary)' : 'transparent' }}>
                            <ClipboardList size={18} /> Admin
                        </Link>
                    )}

                    <Link to="/cart" className="btn" style={{ position: 'relative', display: 'flex', alignItems: 'center', background: location.pathname === '/cart' ? 'var(--primary)' : 'rgba(255,255,255,0.1)', color: 'white' }}>
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span style={{ position: 'absolute', top: -5, right: -5, background: 'var(--primary)', borderRadius: '50%', width: '18px', height: '18px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-dark)' }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'var(--glass)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--glass-border)' }}>
                                <User size={18} color="var(--primary-light)" />
                            </div>
                            <button onClick={handleLogout} className="btn" style={{ background: 'transparent', border: '1px solid var(--glass-border)', color: 'var(--text-muted)' }}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="btn btn-primary">Login</Link>
                    )}
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
