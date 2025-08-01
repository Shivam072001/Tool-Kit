// src/pages/DashboardPage.jsx

import React from 'react';
import { useAuthStore } from '../store/authStore';
import Card from '../components/atoms/Card';

const DashboardPage = () => {
    const { user } = useAuthStore();

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
                Dashboard
            </h1>
            <p className="text-muted-foreground mb-8">
                Welcome back, {user?.email}! Here's your account overview.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 transition-transform hover:scale-105 animate-slideInLeft delay-100">
                    <h3 className="font-bold text-lg text-foreground">Current Plan</h3>
                    <p className="text-3xl font-extrabold text-primary mt-2 capitalize">{user?.subscriptionTier}</p>
                </Card>
                <Card className="p-6 transition-transform hover:scale-105 animate-slideInLeft delay-200">
                    <h3 className="font-bold text-lg text-foreground">Usage Quota</h3>
                    <p className="text-muted-foreground mt-2">Analytics coming soon...</p>
                </Card>
                <Card className="p-6 transition-transform hover:scale-105 animate-slideInLeft delay-300">
                    <h3 className="font-bold text-lg text-foreground">Recent Activity</h3>
                    <p className="text-muted-foreground mt-2">Activity log coming soon...</p>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;
