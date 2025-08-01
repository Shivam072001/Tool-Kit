// src/components/atoms/Button.jsx
import React from 'react';
import Spinner from './Spinner';

const Button = ({ children, onClick, type = 'button', variant = 'primary', disabled = false, className = '', isLoading = false }) => {
    const baseClasses = 'inline-flex items-center justify-center px-6 py-2 rounded-full font-bold transition-all duration-200 ease-in-out transform disabled:opacity-50 disabled:cursor-not-allowed text-center';

    const variants = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-lg',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-lg',
        ghost: 'hover:bg-input text-foreground hover:text-primary',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || isLoading}
            className={`${baseClasses} ${variants[variant]} ${className} `}
        >
            {isLoading && <Spinner className="h-5 w-5 mr-2" />}
            {children}
        </button>
    );
};
export default Button;
