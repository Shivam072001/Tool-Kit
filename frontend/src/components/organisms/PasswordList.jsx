// src/components/organisms/PasswordList.jsx

import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { passwordVaultService } from '../../services/passwordVaultService';
import { encryptVault } from '../../utils/encryption';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
import SharePasswordModal from './SharePasswordModal';
import ResourceListItem from '../molecules/ResourceListItem';
import { EyeIcon, EyeSlashIcon, ClipboardDocumentIcon, TrashIcon, PlusIcon, ShareIcon, ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/solid';
import { OPERATION_STATUSES } from '../../constants';

const PasswordList = ({ vault, setVault, masterPassword, salt }) => {
    const [newItem, setNewItem] = useState({ name: '', username: '', password: '' });
    const [isAdding, setIsAdding] = useState(false);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [breachStatus, setBreachStatus] = useState({});
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [itemToShare, setItemToShare] = useState(null);

    const handleSaveVault = async (newVaultData) => {
        setIsSaving(true);
        try {
            const encryptedData = encryptVault(newVaultData, masterPassword, salt);
            await passwordVaultService.saveVault(encryptedData);
            setVault(newVaultData);
        } catch (error) {
            console.error("Failed to save vault", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        if (!newItem.name || !newItem.username || !newItem.password) return;

        const newEntry = { id: uuidv4(), ...newItem };
        const updatedVault = [...vault, newEntry];
        await handleSaveVault(updatedVault);

        setNewItem({ name: '', username: '', password: '' });
        setIsAdding(false);
    };

    const handleDeleteItem = async (id) => {
        const updatedVault = vault.filter(item => item.id !== id);
        await handleSaveVault(updatedVault);
    };

    const togglePasswordVisibility = (id) => {
        setVisiblePasswords(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    const handleCheckBreach = async (id, password) => {
        setBreachStatus(prev => ({ ...prev, [id]: 'checking' }));
        try {
            const { data } = await passwordVaultService.checkBreach(password);
            setBreachStatus(prev => ({ ...prev, [id]: data }));
        } catch (error) {
            setBreachStatus(prev => ({ ...prev, [id]: OPERATION_STATUSES.ERROR }));
        }
    };

    const handleShare = (item) => {
        setItemToShare(item);
        setIsShareModalOpen(true);
    };

    return (
        <>
            <Card className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-primary-text">Your Vault</h3>
                    {!isAdding && (
                        <Button onClick={() => setIsAdding(true)} variant="ghost" className="flex items-center gap-2">
                            <PlusIcon className="h-5 w-5" /> Add New
                        </Button>
                    )}
                </div>

                {isAdding && (
                    <Card className="p-4 mb-6 bg-input border-border">
                        <form onSubmit={handleAddItem}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="new-name">Name</Label>
                                    <Input id="new-name" type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g., Google" />
                                </div>
                                <div>
                                    <Label htmlFor="new-username">Username/Email</Label>
                                    <Input id="new-username" type="text" value={newItem.username} onChange={(e) => setNewItem({ ...newItem, username: e.target.value })} placeholder="user@example.com" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <Label htmlFor="new-password">Password</Label>
                                <Input id="new-password" type="text" value={newItem.password} onChange={(e) => setNewItem({ ...newItem, password: e.target.value })} placeholder="Your strong password" />
                            </div>
                            <div className="flex gap-2 mt-4 justify-end">
                                <Button onClick={() => setIsAdding(false)} variant="ghost" disabled={isSaving}>Cancel</Button>
                                <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Item'}</Button>
                            </div>
                        </form>
                    </Card>
                )}

                <div className="space-y-4">
                    {vault.length === 0 && !isAdding && (
                        <div className="text-center py-8">
                            <p className="text-muted-foreground">Your vault is empty. Click "Add New" to get started.</p>
                        </div>
                    )}
                    {vault.map(item => (
                        <ResourceListItem
                            key={item.id}
                            actions={
                                <>
                                    <button onClick={() => togglePasswordVisibility(item.id)} className="p-2 text-muted-foreground hover:text-primary-text rounded-full" title={visiblePasswords[item.id] ? 'Hide password' : 'Show password'}>
                                        {visiblePasswords[item.id] ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                    </button>
                                    <button onClick={() => copyToClipboard(item.password)} className="p-2 text-muted-foreground hover:text-primary-text rounded-full" title="Copy password">
                                        <ClipboardDocumentIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleShare(item)} className="p-2 text-muted-foreground hover:text-primary-text rounded-full" title="Share password securely">
                                        <ShareIcon className="h-5 w-5" />
                                    </button>
                                    <button onClick={() => handleCheckBreach(item.id, item.password)} className="p-2 text-muted-foreground hover:text-primary-text rounded-full" title="Check for breaches">
                                        {breachStatus[item.id] === 'checking' ? <Spinner className="h-5 w-5" /> : (
                                            breachStatus[item.id]?.pwned ? <ShieldExclamationIcon className="h-5 w-5 text-destructive" /> : <ShieldCheckIcon className="h-5 w-5 text-green-500" />
                                        )}
                                    </button>
                                    <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-muted-foreground hover:text-destructive rounded-full" title="Delete item">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </>
                            }
                        >
                            <p className="font-bold text-primary-text">{item.name}</p>
                            <p className="text-sm text-muted-foreground">{item.username}</p>
                            {breachStatus[item.id]?.pwned && (
                                <p className="text-xs text-destructive mt-1">
                                    This password has been seen {breachStatus[item.id].count} times in data breaches.
                                </p>
                            )}
                        </ResourceListItem>
                    ))}
                </div>
            </Card>
            <SharePasswordModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                itemToShare={itemToShare}
            />
        </>
    );
};

export default PasswordList;