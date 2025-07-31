// src/pages/PasswordManagerPage.jsx

import React, { useState, useEffect } from 'react';
import { passwordVaultService } from '../services/passwordVaultService';
import { encryptVault, decryptVault } from '../utils/encryption';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Label from '../components/atoms/Label';
import Button from '../components/atoms/Button';
import PasswordList from '../components/organisms/PasswordList';
import PasswordGenerator from '../components/organisms/PasswordGenerator';

const PasswordManagerPage = () => {
    const [masterPassword, setMasterPassword] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [salt, setSalt] = useState('');

    const [vault, setVault] = useState([]); // This will hold the DECRYPTED vault data

    const handleUnlock = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const response = await passwordVaultService.getVault();
            const { vaultData: encryptedData, salt } = response.data;
            setSalt(salt);

            if (!encryptedData) {
                // First time user, vault is empty
                setVault([]);
                setIsUnlocked(true);
            } else {
                const decryptedData = decryptVault(encryptedData, masterPassword, salt);
                if (decryptedData === null) {
                    setError('Incorrect master password.');
                } else {
                    setVault(decryptedData);
                    setIsUnlocked(true);
                }
            }
        } catch (err) {
            setError('Failed to fetch vault. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isUnlocked) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Card className="p-8 w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Unlock Your Vault</h2>
                    <p className="text-center text-muted-foreground mb-4">
                        Enter your master password. This password is never sent to our servers.
                    </p>
                    {error && <p className="text-destructive text-center mb-4">{error}</p>}
                    <form onSubmit={handleUnlock}>
                        <Label htmlFor="master-password">Master Password</Label>
                        <Input id="master-password" type="password" value={masterPassword} onChange={(e) => setMasterPassword(e.target.value)} />
                        <Button type="submit" disabled={isLoading} className="w-full mt-6">
                            {isLoading ? 'Unlocking...' : 'Unlock'}
                        </Button>
                    </form>
                </Card>
            </div>
        );
    }

    // Render the main password manager UI once unlocked
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Password Manager</h1>
            <p className="text-muted-foreground mb-8">Securely store and generate your passwords.</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <PasswordList vault={vault} setVault={setVault} masterPassword={masterPassword} salt={salt} />
                </div>
                <div>
                    <PasswordGenerator />
                </div>
            </div>
        </div>
    );
};

export default PasswordManagerPage;