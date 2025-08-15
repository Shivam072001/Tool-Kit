// src/pages/URLShortenerPage.jsx

import React, { useState, useEffect } from 'react';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Button from '../components/atoms/Button';
import Label from '../components/atoms/Label';
import URLList from '../components/organisms/URLList';
import { shortUrlService } from '../services/shortUrlService';
import ConfirmDeleteModal from '../components/organisms/ConfirmDeleteModal';

const ShortURLPage = () => {
    const [urls, setUrls] = useState([]);
    const [newUrl, setNewUrl] = useState('');
    const [maxClicks, setMaxClicks] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ id: null, name: '' });

    const fetchUrls = async () => {
        try {
            const response = await shortUrlService.getUserUrls();
            setUrls(response.data.urls);
        } catch (error) {
            setError('Failed to fetch your URLs.');
        }
    };

    useEffect(() => {
        fetchUrls();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newUrl) {
            setError('Please enter a URL.');
            return;
        }
        setError('');
        setIsLoading(true);
        try {
            await shortUrlService.createShortUrl(newUrl, maxClicks, expiresAt);
            setNewUrl('');
            setMaxClicks('');
            setExpiresAt('');
            await fetchUrls();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to shorten URL.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable = async (id) => {
        try {
            await shortUrlService.disableShortUrl(id);
            await fetchUrls();
        } catch (err) {
            setError('Failed to disable the URL.');
        }
    };

    const handleEnable = async (id) => {
        const newMaxClicks = window.prompt("Set the number of additional clicks allowed before the link is disabled again:", "100");
        if (newMaxClicks === null) return; // User cancelled the prompt

        const clicks = parseInt(newMaxClicks, 10);
        if (isNaN(clicks) || clicks <= 0) {
            setError("Please enter a valid positive number for clicks.");
            return;
        }

        try {
            await shortUrlService.enableShortUrl(id, clicks);
            await fetchUrls();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to enable the URL.');
        }
    };

    const handleDeleteClick = (id, name) => {
        setItemToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete.id) return;
        try {
            await shortUrlService.deleteShortUrl(itemToDelete.id);
            await fetchUrls();
        } catch (error) {
            setError('Failed to delete the URL.');
        } finally {
            setShowDeleteModal(false);
            setItemToDelete({ id: null, name: '' });
        }
    };

    const getTodayString = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-primary-text">URL Shortener</h1>
            <p className="text-muted-foreground mb-8">Create short, memorable links in seconds.</p>

            <Card className="p-8 animate-fadeIn">
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="long-url">Enter a long URL</Label>
                        <Input
                            id="long-url"
                            type="url"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            placeholder="https://example.com/very-long-url-to-shorten"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="max-clicks">Max Clicks (Optional)</Label>
                            <Input
                                id="max-clicks"
                                type="number"
                                value={maxClicks}
                                onChange={(e) => setMaxClicks(e.target.value)}
                                placeholder="e.g., 100"
                                min="1"
                            />
                        </div>
                        <div>
                            <Label htmlFor="expires-at">Expires At (Optional)</Label>
                            <Input
                                id="expires-at"
                                type="date"
                                value={expiresAt}
                                onChange={(e) => setExpiresAt(e.target.value)}
                                min={getTodayString()}
                            />
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto">
                            Shorten
                        </Button>
                    </div>
                </form>
            </Card>

            {error && <p className="text-destructive text-center my-4">{error}</p>}

            <URLList
                urls={urls}
                onDeleteClick={handleDeleteClick}
                onDisable={handleDisable}
                onEnable={handleEnable}
            />
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete.name}
            />
        </div>
    );
};

export default ShortURLPage;
