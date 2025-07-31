// src/components/organisms/AuthForm.jsx
import React, { useState } from 'react';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Label from '../atoms/Label';

const AuthForm = ({ formType, onSubmit, error, isLoading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const isRegister = formType === 'register';

    const handleSubmit = (e) => {
        e.preventDefault();
        const credentials = isRegister ? { email, password, confirmPassword } : { email, password };
        onSubmit(credentials);
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            {error && (
                <div className="bg-destructive text-destructive-foreground p-3 rounded-md mb-4 text-center">
                    {error}
                </div>
            )}
            <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="mb-6">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {isRegister && (
                <div className="mb-6">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
            )}
            <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
            </Button>
        </form>
    );
};
export default AuthForm;