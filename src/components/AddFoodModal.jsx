import { useState, useRef } from "react";
import { X, Save, UploadCloud, Trash2, Plus } from "lucide-react";
import { api } from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AddFoodModal({ onClose, product = null, onProductUpdated = null }) {
    const [name, setName] = useState(product?.name || "");
    const [price, setPrice] = useState(product?.price || "");
    const [category, setCategory] = useState(product?.category || "Main");
    const [description, setDescription] = useState(product?.description || "");
    const [images, setImages] = useState(product?.images || []);
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isEditMode = !!product;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleAddImage = async () => {
        if (!file && !preview) {
            alert("Please select an image first");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let imageUrl = preview;

            if (file) {
                const uploadData = await api.uploadImage(file);
                imageUrl = uploadData.url;
            }

            if (isEditMode && product._id) {
                // Add image to existing product
                await api.addImageToProduct(product._id, imageUrl, token);
                // Refresh product data
                const updated = await api.getProductById(product._id);
                setImages(updated.images || []);
            } else {
                // Add to local images array for new product
                setImages([...images, { url: imageUrl }]);
            }

            setFile(null);
            setPreview(null);
        } catch (error) {
            alert("Failed to add image: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveImage = async (index) => {
        if (isEditMode && product._id) {
            const token = localStorage.getItem('token');
            try {
                await api.deleteImageFromProduct(product._id, index, token);
                const updated = await api.getProductById(product._id);
                setImages(updated.images || []);
            } catch (error) {
                alert("Failed to remove image: " + error.message);
            }
        } else {
            setImages(images.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        if (!name || !price) {
            setError("Name and Price are required!");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("You must be logged in to add items");
                return;
            }

            if (isEditMode) {
                // Update existing product
                await api.updateProduct(product._id, {
                    name,
                    price: parseFloat(price),
                    category,
                    description,
                }, token);

                if (onProductUpdated) {
                    onProductUpdated();
                } else {
                    window.location.reload();
                }
            } else {
                // Create new product
                if (images.length === 0) {
                    setError("Please add at least one image");
                    return;
                }

                await api.createProduct({
                    name,
                    price: parseFloat(price),
                    images,
                    category,
                    description,
                }, token);

                window.location.reload();
            }

            onClose();
        } catch (error) {
            const message = error.response?.status === 403 
                ? "Admin access required to add/edit products"
                : error.response?.data?.message || error.message;
            setError("Error: " + message);
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
                        maxWidth: "550px",
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

                    <h2 style={{ marginBottom: "20px", textAlign: "center", color: "var(--primary)" }}>
                        {isEditMode ? "Edit Item" : "Add New Item"}
                    </h2>

                    {error && (
                        <div style={{
                            padding: "12px",
                            backgroundColor: "#fee",
                            border: "1px solid #fcc",
                            borderRadius: "6px",
                            color: "#c33",
                            fontSize: "0.9rem"
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                        {/* Image Gallery */}
                        <div style={{ marginBottom: "10px" }}>
                            <label style={{ display: "block", marginBottom: "10px", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: "bold" }}>
                                Photos ({images.length})
                            </label>
                            {images.length > 0 && (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "10px" }}>
                                    {images.map((img, idx) => (
                                        <div key={idx} style={{ position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                                            <img src={img.url} alt={`Photo ${idx}`} style={{ width: "100%", height: "100px", objectFit: "cover" }} />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                style={{
                                                    position: "absolute", top: "4px", right: "4px",
                                                    background: "rgba(255, 0, 0, 0.7)", color: "white",
                                                    border: "none", borderRadius: "50%", width: "24px", height: "24px",
                                                    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                                                }}
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Upload New Image */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            style={{
                                width: "100%", height: "150px", border: "2px dashed var(--glass-border)",
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
                                    <p style={{ color: "var(--text-muted)", marginTop: "10px", fontSize: "0.9rem" }}>Click to upload photo</p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        {preview && (
                            <button
                                type="button"
                                onClick={handleAddImage}
                                disabled={loading}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                    background: "var(--primary)", color: "white", padding: "10px", borderRadius: "8px",
                                    border: "none", fontWeight: "bold", fontSize: "0.9rem", cursor: "pointer"
                                }}
                            >
                                <Plus size={16} /> Add Photo
                            </button>
                        )}

                        {/* Product Details */}
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
                                <label style={{ display: "block", marginBottom: "5px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Category</label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="auth-input"
                                    style={{ width: "100%" }}
                                >
                                    <option value="Main">Main Course</option>
                                    <option value="Appetizer">Appetizer</option>
                                    <option value="Dessert">Dessert</option>
                                    <option value="Beverage">Beverage</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: "block", marginBottom: "5px", color: "var(--text-muted)", fontSize: "0.9rem" }}>Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add item description..."
                                className="auth-input"
                                rows="3"
                                style={{ width: "100%", padding: "8px", borderRadius: "8px" }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: "10px",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                background: "var(--primary)", color: "white", padding: "14px", borderRadius: "8px",
                                border: "none", fontWeight: "bold", fontSize: "1rem", cursor: "pointer"
                            }}
                        >
                            {loading ? "Saving..." : <><Save size={18} /> {isEditMode ? "Update Item" : "Add to Menu"}</>}
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}


