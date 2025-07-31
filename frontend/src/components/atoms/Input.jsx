import React from 'react';

const Input = ({ id, type, value, onChange, placeholder = '', required = false }) => {
    return (
        <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md shadow-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
    );
};
export default Input;