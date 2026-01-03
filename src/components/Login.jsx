import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [signup, setSignup] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    // Validate email format
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validate password strength
    const validatePassword = (password) => {
        return password && password.length >= 6;
    };

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        // Client-side validation
        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            if (signup) {
                const name = email.split('@')[0]; // Use email prefix as default name
                const data = await api.register({ name, email, password });
                login(data, data.token);
                navigate('/menu');
            } else {
                const data = await api.login({ email, password });
                login(data, data.token);
                navigate('/menu');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="auth-card"
            >
                <h1 style={{ marginBottom: '10px' }}>🍽 <br />Fine Dining</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '30px' }}>
                    {signup ? "Create your culinary journey" : "Welcome back, food lover"}
                </p>

                {error && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="error"
                        style={{ color: '#ff6b81', background: 'rgba(255, 107, 129, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={submit}>
                    <input
                        className="auth-input"
                        placeholder="Email Address"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <input
                        className="auth-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        disabled={loading}
                        required
                    />
                    <button style={{ width: '100%', marginTop: '10px' }} disabled={loading}>
                        {loading ? "Processing..." : signup ? "Sign Up" : "Login"}
                    </button>
                </form>

                <div style={{ marginTop: '20px' }}>
                    <button
                        onClick={() => {
                            setSignup(!signup);
                            setError("");
                        }}
                        style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.9rem', padding: 0, border: 'none', cursor: 'pointer' }}
                    >
                        {signup ? "Already have an account? Login" : "Don't have an account? Sign Up"}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
