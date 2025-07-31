import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-card border border-border rounded-lg shadow-lg ${className}`}>
            {children}
        </div>
    );
};
export default Card;