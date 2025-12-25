import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

export default function FoodCard({ food, onClick }) {
  return (
    <motion.div 
      layoutId={`card-${food.id}`}
      className="food-card" 
      onClick={onClick}
      whileHover={{ y: -5 }}
    >
      <div className="food-image-wrapper">
        <img src={food.image} alt={food.name} className="food-image"/>
      </div>
      <div className="food-info">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
          <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{food.name}</h3>
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
      </div>
    </motion.div>
  );
}
