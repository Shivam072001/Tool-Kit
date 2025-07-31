import React from 'react';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <Card className="p-8 w-full max-w-md">
                <div className="flex items-start gap-4">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 sm:mx-0">
                        <ExclamationTriangleIcon className="h-6 w-6 text-destructive" aria-hidden="true" />
                    </div>
                    <div className="mt-0 text-left">
                        <h3 className="text-lg leading-6 font-bold text-foreground">Delete Item</h3>
                        <div className="mt-2">
                            <p className="text-sm text-muted-foreground">
                                Are you sure you want to delete this {itemName}? This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="destructive" onClick={onConfirm}>Delete</Button>
                </div>
            </Card>
        </div>
    );
};

export default ConfirmDeleteModal;