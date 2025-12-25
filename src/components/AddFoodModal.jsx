import { useState, useRef } from "react";
import { X, Save, UploadCloud } from "lucide-react";
import { api } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AddFoodModal({ onClose }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);

    const compressImage = (file) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, "image/jpeg", 0.7);
                };
            };
        });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !price) {
            alert("Name and Price are required!");
            return;
        }

        setLoading(true);
        let finalImageUrl = image;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("You must be logged in to add items");
                return;
            }

            if (file) {
                // Upload to backend (Cloudinary)
                const uploadData = await api.uploadImage(file);
                finalImageUrl = uploadData.url;
            } else if (!finalImageUrl) {
                finalImageUrl = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=60";
            }

            await api.createProduct({
                name,
                price: parseFloat(price),
                image: finalImageUrl,
                rating: 0,
                reviews: [],
                category: 'Main' // Default category
            }, token);

            onClose();
            // Optional: trigger refresh in parent
            window.location.reload();
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="modal-overlay"
                style={{
                    position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)",
                    display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000,
                    backdropFilter: "blur(4px)"
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="modal-content"
                    style={{
                        background: "var(--bg-card)",
                        padding: "30px",
                        borderRadius: "16px",
                        width: "90%",
                        maxWidth: "450px",
                        maxHeight: "90vh",
                        overflowY: "auto",
                        position: "relative",
                        border: "1px solid var(--glass-border)",
                        boxShadow: "var(--shadow)"
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        style={{
                            position: "absolute", top: "15px", right: "15px",
                            background: "rgba(0,0,0,0.3)", border: "none", color: "white",
                            borderRadius: "50%", width: "30px", height: "30px", cursor: "pointer",
                            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10
                        }}
                    >
                        <X size={18} />
                    </button>

                    <h2 style={{ marginBottom: "20px", textAlign: "center", color: "var(--primary)" }}>Add New Item</h2>

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                width: "100%", height: "180px", border: "2px dashed var(--glass-border)",
                                borderRadius: "12px", display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", cursor: "pointer",
                                overflow: "hidden", position: "relative", background: "rgba(0,0,0,0.2)"
                            }}
                        >
                            {preview ? (
                                <img src={preview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                                <>
                                    <UploadCloud size={40} color="var(--text-muted)" />
                                    <p style={{ color: "var(--text-muted)", marginTop: "10px" }}>Click to upload local photo</p>
                                </>
                            )}
                            {loading && uploadProgress > 0 && (
                                <div style={{
                                    position: "absolute", bottom: 0, left: 0, height: "4px",
                                    background: "var(--primary)", width: `${uploadProgress}%`, transition: "width 0.3s"
                                }} />
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Food Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Spicy Ramen..."
                                className="auth-input"
                                required
                            />
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Price ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    placeholder="12.99"
                                    className="auth-input"
                                    required
                                />
                            </div>
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Or URL</label>
                                <input
                                    type="text"
                                    value={image}
                                    onChange={(e) => setImage(e.target.value)}
                                    placeholder="https://..."
                                    className="auth-input"
                                    disabled={!!file}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: "10px",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                background: "var(--primary)", color: "white", padding: "14px", borderRadius: "8px",
                                border: "none", fontWeight: "bold", fontSize: "1rem"
                            }}
                        >
                            {loading ? `Uploading ${Math.round(uploadProgress)}%` : <><Save size={18} /> Add to Menu</>}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

