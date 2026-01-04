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
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const isEditMode = !!product;

    // Validate form inputs
    const validateForm = () => {
        if (!name || name.trim().length < 2) {
            setError("Food name must be at least 2 characters");
            return false;
        }
        if (name.length > 150) {
            setError("Food name is too long");
            return false;
        }
        if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
            setError("Price must be a positive number");
            return false;
        }
        if (parseFloat(price) > 999999) {
            setError("Price is too high");
            return false;
        }
        if (description && description.length > 1000) {
            setError("Description is too long");
            return false;
        }
        return true;
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const validFiles = [];
            const newPreviews = [];
            let hasError = false;

            files.forEach(file => {
                // Validate file size (5MB)
                if (file.size > 5 * 1024 * 1024) {
                    setError(`File "${file.name}" is too large (max 5MB)`);
                    hasError = true;
                    return;
                }
                // Validate file type
                if (!['image/jpeg', 'image/png', 'image/jpg', 'image/webp'].includes(file.type)) {
                    setError(`File "${file.name}" has invalid format (JPG, PNG, WEBP only)`);
                    hasError = true;
                    return;
                }
                validFiles.push(file);
                newPreviews.push(URL.createObjectURL(file));
            });

            if (!hasError) {
                setError(null);
                setSelectedFiles(prev => [...prev, ...validFiles]);
                setPreviews(prev => [...prev, ...newPreviews]);
            }
        }
    };

    const handleRemovePreview = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        // Revoke URL to prevent memory leaks
        URL.revokeObjectURL(previews[index]);
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleAddImages = async () => {
        if (selectedFiles.length === 0) {
            setError("Please select at least one image first");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error("Authentication required");

            // Upload all selected files in a single batch
            const uploadData = await api.uploadImages(selectedFiles);
            const newImageUrls = uploadData.images; // Array of {url, public_id}

            if (isEditMode && product._id) {
                // Add images to existing product using bulk API
                await api.addMultipleImagesToProduct(product._id, newImageUrls, token);

                // Refresh product data
                const updated = await api.getProductById(product._id);
                setImages(updated.images || []);
            } else {
                // Add to local images array for new product
                setImages([...images, ...newImageUrls]);
            }

            // Clean up
            previews.forEach(url => URL.revokeObjectURL(url));
            setSelectedFiles([]);
            setPreviews([]);
            setError(null);
        } catch (error) {
            setError("Failed to add images: " + (error.response?.data?.message || error.message));
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
                setError(null);
            } catch (error) {
                setError("Failed to remove image: " + error.message);
            }
        } else {
            setImages(images.filter((_, i) => i !== index));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) {
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
                    name: name.trim(),
                    price: parseFloat(price),
                    category,
                    description: description.trim(),
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
                    name: name.trim(),
                    price: parseFloat(price),
                    images,
                    category,
                    description: description.trim(),
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
                            fontSize: "0.9rem",
                            marginBottom: "15px"
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
                                width: "100%", minHeight: "150px", border: "2px dashed var(--glass-border)",
                                borderRadius: "12px", display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center", cursor: "pointer",
                                overflow: "hidden", position: "relative", background: "rgba(0,0,0,0.2)",
                                padding: "10px"
                            }}
                        >
                            {previews.length > 0 ? (
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px w-100%", width: "100%" }}>
                                    {previews.map((url, idx) => (
                                        <div key={idx} style={{ position: "relative", aspectRatio: "1/1" }}>
                                            <img src={url} alt={`Preview ${idx}`} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }} />
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleRemovePreview(idx); }}
                                                style={{
                                                    position: "absolute", top: "-5px", right: "-5px",
                                                    background: "red", color: "white", border: "none",
                                                    borderRadius: "50%", width: "20px", height: "20px",
                                                    fontSize: "12px", display: "flex", alignItems: "center",
                                                    justifyContent: "center", cursor: "pointer"
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.1)", borderRadius: "6px", aspectRatio: "1/1" }}>
                                        <Plus size={24} color="var(--text-muted)" />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <UploadCloud size={40} color="var(--text-muted)" />
                                    <p style={{ color: "var(--text-muted)", marginTop: "10px", fontSize: "0.9rem" }}>Click to upload multiple photos</p>
                                </>
                            )}
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />

                        {previews.length > 0 && (
                            <button
                                type="button"
                                onClick={handleAddImages}
                                disabled={loading}
                                style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                                    background: "var(--primary)", color: "white", padding: "10px", borderRadius: "8px",
                                    border: "none", fontWeight: "bold", fontSize: "0.9rem", cursor: "pointer"
                                }}
                            >
                                <Plus size={16} /> Add {selectedFiles.length} Photos
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


