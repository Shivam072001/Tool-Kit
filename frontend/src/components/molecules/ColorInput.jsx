// src/components/molecules/ColorInput.jsx
import React from 'react';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

const ColorInput = ({ label, id, value, onChange }) => (
    <div>
        <Label htmlFor={id}>{label}</Label>
        <div className="relative">
            <Input
                id={id}
                type="text"
                value={value}
                onChange={onChange}
                className="w-full pl-12"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                <input
                    type="color"
                    value={value}
                    onChange={onChange}
                    className="h-8 w-8 p-0 border-none rounded cursor-pointer"
                    style={{ backgroundColor: value }}
                />
            </div>
        </div>
    </div>
);
export default ColorInput;