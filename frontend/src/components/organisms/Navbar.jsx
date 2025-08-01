// src/components/organisms/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import ThemeSwitcher from '../molecules/ThemeSwitcher';
import Button from '../atoms/Button';
import { ROUTES } from '../../constants';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const { logout, user, isAuthenticated } = useAuthStore();
    const location = useLocation();

    // Do not render the full navbar on landing or pricing pages
    if (location.pathname === '/' || location.pathname === '/pricing' || location.pathname === '/login' || location.pathname === '/register' || location.pathname.startsWith('/share')) {
        return (
            <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <Link to="/" className="text-xl font-bold text-foreground">
                        UtilityBox
                    </Link>
                    <div className="flex items-center gap-4">
                        <Link to="/pricing" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                            Pricing
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <ThemeSwitcher />
                                <Button onClick={logout} variant="destructive">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Link to="/login">
                                <Button variant="primary">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
        );
    }

    // Default navbar for protected pages
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
