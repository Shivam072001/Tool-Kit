// src/components/organisms/ApiKeysManager.jsx

import React, { useState, useEffect } from 'react';
import { apiKeyService } from '../../services/apiKeyService';
import Card from '../atoms/Card';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
import Button from '../atoms/Button';
import { KeyIcon } from '@heroicons/react/24/outline';
import Spinner from '../atoms/Spinner';

const ApiKeysManager = () => {
    const [keys, setKeys] = useState({
        openai: '',
        gemini: '',
        claude: '',
        perplexity: ''
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchKeys = async () => {
            try {
                const response = await apiKeyService.getApiKeys();
                // Ensure we don't overwrite with null or undefined if the backend sends sparse data
                const fetchedKeys = response.data.keys || {};
                setKeys(prev => ({ ...prev, ...fetchedKeys }));
            } catch (error) {
                setMessage('Could not load your API keys.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchKeys();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setKeys(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage('');
        try {
            // Filter out any keys that are just placeholders before saving
            const keysToSave = Object.fromEntries(
                Object.entries(keys).filter(([_, value]) => value && !value.includes('••••'))
            );

            if (Object.keys(keysToSave).length > 0) {
                await apiKeyService.saveApiKeys(keysToSave);
                setMessage('API keys saved successfully!');
            } else {
                setMessage('No new keys to save.');
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to save API keys.');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <Card className="p-6 mt-6 flex justify-center items-center">
                <Spinner />
                <p className="ml-4">Loading API Key settings...</p>
            </Card>
        );
    }

    return (
        <Card className="p-6 mt-6 animate-slideInLeft delay-400">
            <h3 className="font-bold text-lg text-primary-text mb-4 flex items-center">
                <KeyIcon className="h-6 w-6 mr-2 text-primary" />
                Custom LLM API Keys
            </h3>
            <p className="text-muted-foreground mb-4 text-sm">
                As an Elite user, you can use your own API keys for unlimited access to LLM features.
            </p>
            <div className="space-y-4">
                {Object.keys(keys).map(provider => (
                    <div key={provider}>
                        <Label htmlFor={provider} className="capitalize">{provider} API Key</Label>
                        <Input
                            id={provider}
                            name={provider}
                            type="password"
                            value={keys[provider]}
                            onChange={handleChange}
                            placeholder={`Enter your ${provider} key`}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-6 flex items-center justify-between">
                <Button onClick={handleSave} isLoading={isSaving}>
                    Save Keys
                </Button>
                {message && <p className="text-sm text-primary">{message}</p>}
            </div>
        </Card>
    );
};

export default ApiKeysManager;