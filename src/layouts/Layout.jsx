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
            <header className="glass-panel" style={{
                position: 'fixed',
                top: '0',
                left: '0',
                right: '0',
                width: '100%',
                zIndex: 1000,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 40px', // Increased horizontal padding
                borderRadius: '0 0 16px 16px', // Rounded bottom corners
                borderTop: 'none',
                margin: '0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
                <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'linear-gradient(45deg, var(--primary), var(--primary-light))', padding: '6px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}>🍽️</span>
                    </div>
                    <h2 style={{
                        fontSize: '1.3rem',
                        background: 'linear-gradient(to right, #fff, #ccc)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0,
                        fontWeight: '800',
                        letterSpacing: '1px'
                    }}>
                        FINE DINING
                    </h2>
                </Link>

                <nav style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <Link to="/menu" className={`btn ${location.pathname === '/menu' || location.pathname === '/' ? 'btn-primary' : 'btn-secondary'}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                        <MenuIcon size={18} /> Menu
                    </Link>

                    {user && (
                        <Link to="/my-orders" className={`btn ${location.pathname === '/my-orders' ? 'btn-primary' : 'btn-secondary'}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                            <ClipboardList size={18} /> My Orders
                        </Link>
                    )}

                    {userRole === 'admin' && (
                        <Link to="/admin/orders" className={`btn ${location.pathname === '/admin/orders' ? 'btn-primary' : 'btn-secondary'}`} style={{ display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none' }}>
                            <ClipboardList size={18} /> Admin
                        </Link>
                    )}

                    <Link to="/cart" className="btn btn-secondary" style={{ position: 'relative', display: 'flex', alignItems: 'center', background: location.pathname === '/cart' ? 'var(--primary)' : 'rgba(255,255,255,0.05)' }}>
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
                            <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px' }}>
                                <LogOut size={18} />
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <Link to="/login" className="btn btn-secondary" style={{ padding: '8px 15px', fontSize: '0.9rem' }}>Login</Link>
                            <Link to="/login?register=true" className="btn btn-primary" style={{ padding: '8px 15px', fontSize: '0.9rem' }}>Sign Up</Link>
                        </div>
                    )}
                </nav>
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}
