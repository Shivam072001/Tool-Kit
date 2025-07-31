// src/components/organisms/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import ThemeSwitcher from '../molecules/ThemeSwitcher';
import Button from '../atoms/Button';
import { ROUTES } from '../../constants';

const Navbar = () => {
    const { logout, user } = useAuthStore();
    return (
        <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <Link to={ROUTES.DASHBOARD} className="text-xl font-bold text-foreground">
                    UtilityBox
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-foreground hidden sm:block">Welcome, {user?.email}</span>
                    <ThemeSwitcher />
                    <Button onClick={logout} variant="destructive">
                        Logout
                    </Button>
                </div>
            </div>
        </nav>
    );
};
export default Navbar;