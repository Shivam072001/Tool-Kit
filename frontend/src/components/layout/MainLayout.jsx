// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../organisms/Navbar';
import Sidebar from '../organisms/Sidebar';

const MainLayout = () => {
    return (
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 p-8 overflow-y-auto bg-background">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
export default MainLayout;