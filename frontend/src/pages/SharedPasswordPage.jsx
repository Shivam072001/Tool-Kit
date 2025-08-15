// src/pages/SharedPasswordPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { passwordVaultService } from '../services/passwordVaultService';
import Card from '../components/atoms/Card';
import Spinner from '../components/atoms/Spinner';
import { EyeIcon, EyeSlashIcon, ClipboardDocumentIcon } from '@heroicons/react/24/solid';
import { OPERATION_STATUSES } from '../constants';

const SharedPasswordPage = () => {
    const { accessToken } = useParams();
    const [item, setItem] = useState(null);
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [error, setError] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useEffect(() => {
        const claim = async () => {
            try {
                const response = await passwordVaultService.claimShare(accessToken);
                setItem(response.data.passwordItem);
                setStatus(OPERATION_STATUSES.SUCCESS);
            } catch (err) {
                setError(err.response?.data?.message || 'Could not retrieve shared item.');
                setStatus(OPERATION_STATUSES.ERROR);
            }
        };
        claim();
    }, [accessToken]);

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary-bg">
            <Card className="p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-primary-text">View Shared Password</h2>

                {status === 'loading' && <div className="flex justify-center"><Spinner /></div>}

                {status === OPERATION_STATUSES.ERROR && <p className="text-destructive text-center">{error}</p>}

                {status === OPERATION_STATUSES.SUCCESS && item && (
                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Website/Service</p>
                            <p className="text-lg text-primary-text">{item.name}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Username/Email</p>
                            <p className="text-lg text-primary-text">{item.username}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Password</p>
                            <div className="flex items-center gap-2 bg-input p-2 rounded-md">
                                <input
                                    type={isPasswordVisible ? 'text' : 'password'}
                                    value={item.password}
                                    readOnly
                                    className="bg-transparent w-full focus:outline-none"
                                />
                                <button onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="p-1">
                                    {isPasswordVisible ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                                <button onClick={() => copyToClipboard(item.password)} className="p-1">
                                    <ClipboardDocumentIcon className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-muted-foreground text-center pt-4">This link has now been invalidated and cannot be used again.</p>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default SharedPasswordPage;