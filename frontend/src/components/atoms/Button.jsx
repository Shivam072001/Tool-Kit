// src/components/atoms/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '' }) => {
    const baseClasses = 'px-6 py-2 rounded-md font-bold transition-opacity disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary text-primary-foreground hover:opacity-90',
        secondary: 'bg-secondary text-primary-foreground hover:opacity-90',
        destructive: 'bg-destructive text-destructive-foreground hover:opacity-90',
        ghost: 'hover:bg-border text-foreground',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${className}`}
        >
            {children}
        </button>
    );
};
export default Button;