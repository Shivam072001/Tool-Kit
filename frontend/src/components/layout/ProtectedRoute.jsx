// src/components/layout/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { BASE_ROUTE, ROUTES } from '../../constants';

const ProtectedRoute = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const [hasHydrated, setHasHydrated] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (useAuthStore.persist.hasHydrated()) {
            setHasHydrated(true);
            return;
        }

        const unsub = useAuthStore.persist.onFinishHydration(() => {
            setHasHydrated(true);
        });

        return unsub;
    }, []);

    if (!hasHydrated) {
        return <div>Loading...</div>;
    }

    if (isAuthenticated && (location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER)) {
        return <Navigate to={BASE_ROUTE + ROUTES.DASHBOARD} replace />;
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
