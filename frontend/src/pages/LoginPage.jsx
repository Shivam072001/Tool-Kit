// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import AuthForm from '../components/organisms/AuthForm';
import Card from '../components/atoms/Card';
import { ROUTES } from '../constants';

const LoginPage = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const loginAction = useAuthStore((state) => state.login);

    const handleLogin = async ({ email, password }) => {
        setError(null);
        setIsLoading(true);
        try {
            const { token, data } = await authService.login({ email, password });
            loginAction({ user: data.user, token });
            navigate(ROUTES.DASHBOARD);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to log in.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="p-8 w-full max-w-md shadow-2xl animate-fadeIn">
                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Welcome Back</h2>
                <AuthForm formType="login" onSubmit={handleLogin} error={error} isLoading={isLoading} />
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/register" className="font-medium text-primary hover:underline transition-colors">
                        Register
                    </Link>
                </p>
            </Card>
        </div>
    );
};
export default LoginPage;
