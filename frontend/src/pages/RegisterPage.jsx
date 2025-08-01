import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuthStore } from '../store/authStore';
import AuthForm from '../components/organisms/AuthForm';
import Card from '../components/atoms/Card';
import { ROUTES } from '../constants';

const RegisterPage = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const loginAction = useAuthStore((state) => state.login);

    const handleRegister = async ({ email, password, confirmPassword }) => {
        // --- Client-side validation ---
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setError(null);
        setIsLoading(true);
        try {
            const { token, data } = await authService.register({ email, password });
            loginAction({ user: data.user, token });
            navigate(ROUTES.DASHBOARD);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Card className="p-8 w-full max-w-md shadow-2xl animate-fadeIn">
                <h2 className="text-3xl font-bold mb-6 text-center text-foreground">Create an Account</h2>
                <AuthForm
                    formType="register"
                    onSubmit={handleRegister}
                    error={error}
                    isLoading={isLoading}
                />
                <p className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary hover:underline transition-colors">
                        Login
                    </Link>
                </p>
            </Card>
        </div>
    );
};

export default RegisterPage;
