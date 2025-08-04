// src/pages/PricingPage.jsx

import React, { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

const pricingPlans = {
    monthly: [{
        name: 'Free',
        price: '0',
        description: 'Essential tools to get you started.',
        isPopular: false,
        features: [
            '2 Tool Uses per Day',
            '2 AI LLM Calls per Day',
            '1 Day Data Retention',
            'No Permanent Storage',
        ],
        unavailableFeatures: [
            'Increased Limits',
            'Long-term Storage',
            'Bring Your Own LLM API Keys',
            'Priority Support',
        ]
    }, {
        name: 'Pro',
        price: '19',
        description: 'For power users who need more.',
        isPopular: true,
        features: [
            '20 Tool Uses per Day',
            '15 AI LLM Calls per Day',
            '5 Months Data Retention',
            '15GB Permanent Storage',
            'Priority Support',
        ],
        unavailableFeatures: [
            'Bring Your Own LLM API Keys',
            'Unlimited Tool Usage',
        ]
    }, {
        name: 'Elite',
        price: '49',
        description: 'For professionals and teams who need it all.',
        isPopular: false,
        features: [
            'Unlimited Tool Usage',
            '75 AI LLM Calls per Day',
            '2 Years Data Retention',
            '70GB Permanent Storage',
            'Bring Your Own LLM API Keys',
            'Priority Support',
        ]
    },],
    yearly: [{
        name: 'Free',
        price: '0',
        description: 'Essential tools to get you started.',
        isPopular: false,
        features: [
            '2 Tool Uses per Day',
            '2 AI LLM Calls per Day',
            '1 Day Data Retention',
            'No Permanent Storage',
        ],
        unavailableFeatures: [
            'Increased Limits',
            'Long-term Storage',
            'Bring Your Own LLM API Keys',
            'Priority Support',
        ]
    }, {
        name: 'Pro',
        price: '199',
        description: 'For power users who need more.',
        isPopular: true,
        features: [
            '20 Tool Uses per Day',
            '15 AI LLM Calls per Day',
            '5 Months Data Retention',
            '15GB Permanent Storage',
            'Priority Support',
        ],
        unavailableFeatures: [
            'Bring Your Own LLM API Keys',
            'Unlimited Tool Usage',
        ]
    }, {
        name: 'Elite',
        price: '499',
        description: 'For professionals and teams who need it all.',
        isPopular: false,
        features: [
            'Unlimited Tool Usage',
            '75 AI LLM Calls per Day',
            '2 Years Data Retention',
            '70GB Permanent Storage',
            'Bring Your Own LLM API Keys',
            'Priority Support',
        ]
    },]
};


const PricingPage = () => {
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'

    const plans = pricingPlans[billingCycle];

    return (
        <div className="min-h-screen bg-background text-foreground p-8 flex flex-col items-center">
            <header className="text-center py-16 animate-fadeIn">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Choose the perfect plan that fits your needs. Start with our free tier, or go Pro to unlock all our powerful tools.
                </p>
            </header>

            {/* Billing Toggle */}
            <div className="flex items-center gap-4 mb-12 animate-fadeIn delay-300">
                <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${billingCycle === 'monthly' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-foreground hover:bg-input'}`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setBillingCycle('yearly')}
                    className={`px-6 py-2 rounded-full font-bold transition-all duration-300 ${billingCycle === 'yearly' ? 'bg-primary text-primary-foreground shadow-lg' : 'text-foreground hover:bg-input'}`}
                >
                    Yearly (Save 15%)
                </button>
            </div>

            {/* Pricing Cards */}
            <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
                {plans.map((plan, index) => (
                    <div
                        key={plan.name}
                        className={`bg-card rounded-3xl p-8 flex flex-col border-2 transition-all duration-300 transform hover:scale-105 ${plan.isPopular ? 'border-primary shadow-2xl' : 'border-border shadow-lg'}`}
                        style={{ animationDelay: `${500 + index * 100}ms` }}
                    >
                        {plan.isPopular && (
                            <span className="absolute top-0 right-0 mt-4 mr-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase rounded-full tracking-wide shadow-md">
                                Most Popular
                            </span>
                        )}
                        <h2 className="text-3xl font-extrabold mb-2 text-foreground">{plan.name}</h2>
                        <p className="text-muted-foreground mb-6 h-12 flex-shrink-0">{plan.description}</p>
                        <p className="text-5xl font-bold mb-1 text-foreground flex items-baseline">
                            ${plan.price}
                            {plan.price !== '0' && <span className="text-lg font-normal text-muted-foreground ml-1">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>}
                        </p>
                        <div className="flex-1 mt-6">
                            <ul className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <CheckCircleIcon className="h-6 w-6 text-primary" />
                                        <span className="text-foreground">{feature}</span>
                                    </li>
                                ))}
                                {plan.unavailableFeatures && plan.unavailableFeatures.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                        <XCircleIcon className="h-6 w-6 opacity-50" />
                                        <span className="line-through">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <Link
                            to={plan.price === '0' ? ROUTES.REGISTER : '#'}
                            className={`mt-8 w-full block text-center px-6 py-3 rounded-full font-bold transition-all duration-300 ${plan.isPopular ? 'bg-primary text-primary-foreground hover:shadow-xl' : 'bg-input text-foreground hover:bg-border'}`}
                        >
                            {plan.price === '0' ? 'Get Started Free' : 'Choose Plan'}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingPage;