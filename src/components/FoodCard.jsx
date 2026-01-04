import React from "react";
import { Star, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FoodCard({ food, onClick, onEdit, onDelete, isAdmin = false }) {
  const handleEditClick = (e) => {
    e.stopPropagation();
    if (onEdit && isAdmin) onEdit(food);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete && isAdmin) {
      onDelete(food._id);
    }
  };

  return (
    <motion.div
      className="food-card"
      onClick={onClick}
      whileHover={{ y: -5 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{ position: "relative" }}
    >
      <div className="food-image-wrapper">
        <img
          src={food.image || (food.images && food.images[0]?.url) || 'https://via.placeholder.com/500x500?text=No+Image'}
          alt={food.name}
          loading="lazy"
          className="food-image"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/500x500?text=No+Image'; }}
        />
      </div>
      <div className="food-info">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem", maxWidth: "70%" }}>{food.name}</h3>
          <p className="food-price">${food.price}</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "12px", color: "var(--text-muted)" }}>
          <Star size={16} fill={food.rating ? "#FFD700" : "none"} color={food.rating ? "#FFD700" : "#A4B0BE"} />
          <span style={{ fontWeight: 600, color: "var(--text-main)" }}>
            {food.rating ? food.rating.toFixed(1) : "New"}
          </span>
          <span></span>
          <span>
            {food.reviews?.length || 0} reviews
          </span>
        </div>

        {/* Edit and Delete buttons - Only show for admins */}
        <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
          {isAdmin && onEdit && (
            <button
              onClick={handleEditClick}
              style={{
                display: "flex", alignItems: "center", gap: "4px",
                background: "rgba(100, 150, 255, 0.2)", color: "#6496ff",
                border: "1px solid #6496ff", borderRadius: "6px", padding: "6px 10px",
                cursor: "pointer", fontSize: "0.85rem", fontWeight: "500"
              }}
            >
              <Edit2 size={14} /> Edit
            </button>
          )}
          {isAdmin && onDelete && (
            <button
              onClick={handleDeleteClick}
              style={{
                display: "flex", alignItems: "center", gap: "4px",
                background: "rgba(255, 100, 100, 0.2)", color: "#ff6464",
                border: "1px solid #ff6464", borderRadius: "6px", padding: "6px 10px",
                cursor: "pointer", fontSize: "0.85rem", fontWeight: "500"
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
