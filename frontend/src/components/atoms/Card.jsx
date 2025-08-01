// src/components/atoms/Card.jsx
import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-card border border-border rounded-xl shadow-lg transition-all duration-300 ${className}`}>
            {children}
        </div>
    );
};
export default Card;
