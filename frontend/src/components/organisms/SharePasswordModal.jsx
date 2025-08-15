// src/components/organisms/SharePasswordModal.jsx

import React, { useState } from 'react';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
import { XMarkIcon, ClipboardDocumentIcon, LinkIcon } from '@heroicons/react/24/solid';
import { passwordVaultService } from '../../services/passwordVaultService';
import { OPERATION_STATUSES } from '../../constants';

const SharePasswordModal = ({ isOpen, onClose, itemToShare }) => {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [expiresIn, setExpiresIn] = useState('60'); // Default to 60 minutes
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [shareLink, setShareLink] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleShare = async () => {
        setStatus('loading');
        setError('');
        try {
            const response = await passwordVaultService.createShare({
                recipientEmail,
                passwordItem: itemToShare,
                expiresIn,
            });
            const link = `${window.location.origin}/share/${response.data.accessToken}`;
            setShareLink(link);
            setStatus(OPERATION_STATUSES.SUCCESS);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create share link.');
            setStatus(OPERATION_STATUSES.ERROR);
        }
    };

    const copyLink = () => {
        navigator.clipboard.writeText(shareLink);
    };

    const resetAndClose = () => {
        setRecipientEmail('');
        setExpiresIn('60');
        setStatus('idle');
        setShareLink('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <Card className="p-8 w-full max-w-md relative">
                <button onClick={resetAndClose} className="absolute top-4 right-4 p-1 rounded-full hover:bg-border">
                    <XMarkIcon className="h-6 w-6 text-muted-foreground" />
                </button>
                <h3 className="text-xl font-bold text-primary-text mb-4">Share '{itemToShare.name}'</h3>

                {status !== OPERATION_STATUSES.SUCCESS && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="recipient-email">Recipient's Email</Label>
                            <Input id="recipient-email" type="email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="recipient@example.com" />
                        </div>
                        <div>
                            <Label htmlFor="expires-in">Expires In</Label>
                            <select id="expires-in" value={expiresIn} onChange={(e) => setExpiresIn(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md">
                                <option value="5">5 Minutes</option>
                                <option value="60">1 Hour</option>
                                <option value="1440">1 Day</option>
                                <option value="10080">7 Days</option>
                            </select>
                        </div>
                        <Button onClick={handleShare} disabled={status === 'loading'} className="w-full">
                            {status === 'loading' ? 'Generating Link...' : 'Create Secure Link'}
                        </Button>
                        {status === OPERATION_STATUSES.ERROR && <p className="text-destructive text-center">{error}</p>}
                    </div>
                )}

                {status === OPERATION_STATUSES.SUCCESS && (
                    <div>
                        <p className="text-green-500 text-center mb-4">Secure link generated!</p>
                        <div className="flex items-center gap-2 bg-input p-2 rounded-md">
                            <LinkIcon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                            <Input type="text" value={shareLink} readOnly />
                            <Button onClick={copyLink} variant="ghost" className="p-2">
                                <ClipboardDocumentIcon className="h-5 w-5" />
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Send this link to the recipient. It's a one-time use link and will expire.</p>
                    </div>
                )}

            </Card>
        </div>
    );
};

export default SharePasswordModal;