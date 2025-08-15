// src/pages/TemporaryEmailPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import { temporaryEmailService } from '../services/temporaryEmailService.js';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Inbox from '../components/organisms/Inbox';
import Spinner from '../components/atoms/Spinner.jsx';
import { ClipboardDocumentIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import { useAuthStore } from '../store/authStore.js';
import { config } from '../config/env.js';
import Input from '../components/atoms/Input.jsx';
import Label from '../components/atoms/Label.jsx';

const TemporaryEmailPage = () => {
    const { user } = useAuthStore();
    const [emailData, setEmailData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [forwardingAddress, setForwardingAddress] = useState('');
    const [forwardingEnabled, setForwardingEnabled] = useState(false);
    const [isSavingForward, setIsSavingForward] = useState(false);

    const fetchInbox = useCallback(async () => {
        try {
            const response = await temporaryEmailService.getInbox();
            setEmailData(response.data.email);
            if (response.data.email) {
                setForwardingAddress(response.data.email.forwardingAddress || '');
                setForwardingEnabled(response.data.email.forwardingEnabled || false);
            }
        } catch (err) {
            setError('Could not fetch inbox. Please try refreshing.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchInbox();
        const socket = io(config.apiGatewayUrl, {
            auth: { token: useAuthStore.getState().token }
        });

        if (user?.id) {
            socket.emit('join_room', user.id);
        }

        socket.on('new_email', (newEmailData) => {
            setEmailData(newEmailData);
        });

        return () => {
            socket.disconnect();
        };
    }, [fetchInbox, user]);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await temporaryEmailService.generateNewEmail();
            setEmailData(response.data.email);
            setForwardingAddress('');
            setForwardingEnabled(false);
        } catch (err) {
            setError('Failed to generate a new email address.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveForwarding = async () => {
        setIsSavingForward(true);
        try {
            const response = await temporaryEmailService.updateForwarding({
                forwardingAddress,
                forwardingEnabled
            });
            setEmailData(response.data.email);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save settings.');
        } finally {
            setIsSavingForward(false);
        }
    };

    const handleDelete = async () => {
        if (!emailData) return;
        setIsLoading(true);
        try {
            await temporaryEmailService.deleteEmail(emailData._id);
            setEmailData(null);
        } catch (err) {
            setError('Failed to delete the email address.');
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (emailData?.emailAddress) {
            navigator.clipboard.writeText(emailData.emailAddress);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-4xl font-bold mb-2 text-primary-text">Temporary Email Generator</h1>
            <p className="text-muted-foreground mb-8">
                Instantly create a disposable email address. Emails expire after one hour.
            </p>

            <Card className="p-8">
                {isLoading && !emailData ? (
                    <div className="flex justify-center"><Spinner /></div>
                ) : (
                    <>
                        <div className="bg-input p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 border border-border">
                            <span className="font-mono text-lg text-primary break-all">
                                {emailData ? emailData.emailAddress : 'No active email'}
                            </span>
                            <div className="flex gap-2 flex-shrink-0">
                                <Button onClick={copyToClipboard} variant="ghost" disabled={!emailData || copied}>
                                    <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                                <Button onClick={handleDelete} variant="destructive" disabled={!emailData}>
                                    <TrashIcon className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center">
                            <Button onClick={handleGenerate} variant="secondary">
                                <ArrowPathIcon className="h-5 w-5 mr-2" />
                                {emailData ? 'Generate New Address' : 'Generate Email'}
                            </Button>
                        </div>
                        {error && <p className="text-destructive text-center mt-4">{error}</p>}
                    </>
                )}
            </Card>

            {emailData && (
                <Card className="mt-8 p-8 animate-fadeIn delay-100">
                    <h3 className="text-xl font-bold text-primary-text">Email Forwarding</h3>
                    <p className="text-muted-foreground mt-1 mb-4">
                        Automatically forward incoming emails to another address.
                    </p>
                    <div className="flex items-center space-x-2 mb-4">
                        <input
                            type="checkbox"
                            id="forward-toggle"
                            checked={forwardingEnabled}
                            onChange={(e) => setForwardingEnabled(e.target.checked)}
                            className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                        />
                        <Label htmlFor="forward-toggle">Enable Forwarding</Label>
                    </div>

                    {forwardingEnabled && (
                        <div className="mt-4">
                            <Label htmlFor="forwarding-address">Forward to Email</Label>
                            <Input
                                id="forwarding-address"
                                type="email"
                                value={forwardingAddress}
                                onChange={(e) => setForwardingAddress(e.target.value)}
                                placeholder="your-real-email@example.com"
                            />
                        </div>
                    )}

                    <div className="mt-6">
                        <Button onClick={handleSaveForwarding} isLoading={isSavingForward}>
                            Save Settings
                        </Button>
                    </div>
                </Card>
            )}

            <Card className="mt-8 p-6 animate-fadeIn delay-200">
                <Inbox emails={emailData?.inbox} />
            </Card>
        </div>
    );
};

export default TemporaryEmailPage;
