// src/pages/LandingPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';
import {
    SparklesIcon,
    LinkIcon,
    KeyIcon,
    EnvelopeIcon,
    DocumentTextIcon,
    TableCellsIcon,
    WrenchIcon,
} from '@heroicons/react/24/outline';

const features = [
    {
        icon: SparklesIcon,
        title: 'AI-Powered Tools',
        description: 'Effortlessly summarize documents, check grammar, and more with our intelligent AI toolkit.',
    },
    {
        icon: LinkIcon,
        title: 'URL Shortener',
        description: 'Create short, memorable links and track their performance and clicks with advanced analytics.',
    },
    {
        icon: KeyIcon,
        title: 'Secure Password Manager',
        description: 'Store and manage all your passwords securely in an encrypted vault, accessible only by you.',
    },
    {
        icon: EnvelopeIcon,
        title: 'Temporary Email',
        description: 'Generate a disposable email address to protect your privacy and avoid spam from online services.',
    },
    {
        icon: TableCellsIcon,
        title: 'Fake Data Generator',
        description: 'Quickly generate realistic placeholder data for development and testing of your applications.',
    },
    {
        icon: WrenchIcon,
        title: 'Developer Tools',
        description: 'A collection of developer-centric utilities like regex testers, text diffs, and metadata inspectors.',
    },
];

const LandingPage = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-background text-foreground overflow-x-hidden p-8">
            {/* Hero Section */}
            <header className="relative w-full max-w-7xl mx-auto text-center py-20 animate-fadeIn">
                <div className="absolute inset-0 bg-primary/10 rounded-full h-96 w-96 -top-20 -left-20 animate-pulse-slow"></div>
                <div className="absolute inset-0 bg-secondary/10 rounded-full h-96 w-96 -bottom-20 -right-20 animate-pulse-slow delay-200"></div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
                    <span className="text-primary block">Your All-in-One Utility</span>
                    <span className="text-foreground block">Box for the Web</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fadeIn delay-300">
                    Simplify your daily tasks with a suite of powerful, integrated tools. From file compression to secure password management, we've got you covered.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link to={ROUTES.DASHBOARD} className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                        Get Started
                    </Link>
                    <Link to="/pricing" className="px-8 py-3 text-primary font-bold rounded-full border-2 border-primary hover:bg-primary/10 transition-colors duration-300 transform hover:scale-105">
                        View Plans
                    </Link>
                </div>
            </header>

            {/* Features Section */}
            <section className="w-full max-w-7xl mx-auto py-20">
                <h2 className="text-4xl font-bold text-center mb-12 animate-fadeIn delay-500">
                    Everything You Need, In One Place
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="bg-card p-8 rounded-xl shadow-lg border border-border flex flex-col items-center text-center transition-transform hover:scale-105 duration-300 animate-fadeIn"
                            style={{ animationDelay: `${500 + index * 100}ms` }}
                        >
                            <feature.icon className="h-16 w-16 text-primary mb-4" />
                            <h3 className="text-2xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="w-full max-w-7xl mx-auto py-20 text-center bg-primary/10 rounded-xl my-16 shadow-xl animate-fadeIn delay-1000">
                <h2 className="text-4xl font-bold mb-4">Ready to simplify your workflow?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                    Join thousands of users who trust UtilityBox to power their day-to-day tasks.
                </p>
                <Link to="/register" className="px-10 py-4 bg-primary text-primary-foreground font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    Start for Free
                </Link>
            </section>
        </div>
    );
};

export default LandingPage;
