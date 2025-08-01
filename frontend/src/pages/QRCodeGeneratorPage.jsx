// src/pages/QRCodeGeneratorPage.jsx

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import jsQR from 'jsqr';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Label from '../components/atoms/Label';
import Button from '../components/atoms/Button';
import Dropzone from '../components/molecules/Dropzone.jsx';
import { QrCodeIcon, DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { qrCodeService } from '../services/qrCodeService.js';
import QRCodeList from '../components/organisms/QRCodeList.jsx';
import ConfirmDeleteModal from '../components/organisms/ConfirmDeleteModal.jsx';

const QRCodeGeneratorPage = () => {
    const [activeTab, setActiveTab] = useState('generate');

    // --- Generator State ---
    const [qrValue, setQrValue] = useState('https://utilitybox.app');
    const [qrBgColor, setQrBgColor] = useState('#FFFFFF');
    const [qrFgColor, setQrFgColor] = useState('#000000');
    const [isSaving, setIsSaving] = useState(false);
    const qrCodeRef = useRef(null);

    // --- Reader State ---
    const [readerResult, setReaderResult] = useState('');
    const [readerError, setReaderError] = useState('');

    // --- Data State ---
    const [savedQRCodes, setSavedQRCodes] = useState([]);

    // --- Delete Modal State ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);
    const [maxScans, setMaxScans] = useState(null);

    const fetchQRCodes = useCallback(async () => {
        try {
            const response = await qrCodeService.getAll();
            setSavedQRCodes(response.data.qrCodes);
        } catch (error) {
            console.error("Failed to fetch QR codes", error);
        }
    }, []);

    useEffect(() => {
        if (activeTab === 'generate') {
            fetchQRCodes();
        }
    }, [activeTab, fetchQRCodes]);

    const handleDownload = () => {
        if (!qrCodeRef.current) return;
        const svgElement = qrCodeRef.current;
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
            canvas.width = 280; // Padded for better scanning
            canvas.height = 280;
            ctx.fillStyle = qrBgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 12, 12); // Add padding
            const pngFile = canvas.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = 'qrcode.png';
            downloadLink.href = pngFile;
            downloadLink.click();
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await qrCodeService.create({
                value: qrValue,
                backgroundColor: qrBgColor,
                foregroundColor: qrFgColor,
                maxScans: maxScans
            });
            await fetchQRCodes();
            setMaxScans('');
        } catch (error) {
            console.error("Failed to save QR code", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDisable = async (id) => {
        try {
            await qrCodeService.disable(id);
            await fetchQRCodes();
        } catch (error) {
            console.error("Failed to disable QR Code", error);
        }
    };

    const handleEnable = async (id) => {
        const newMaxScans = window.prompt("Set the number of additional scans allowed:", "100");
        if (newMaxScans === null || isNaN(parseInt(newMaxScans, 10)) || parseInt(newMaxScans, 10) <= 0) {
            return; // Or show an error
        }
        try {
            await qrCodeService.enable(id, newMaxScans);
            await fetchQRCodes();
        } catch (error) {
            console.error("Failed to enable QR Code", error);
        }
    };

    const handleQrRead = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
                    const code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        setReaderResult(code.data);
                        setReaderError('');
                    } else {
                        setReaderResult('');
                        setReaderError('No QR code found in the image. Please try another one.');
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    }, []);

    const handleDeleteClick = (id, name) => {
        setItemToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete.id) return;
        setIsDeleting(true);
        try {
            await qrCodeService.delete(itemToDelete.id);
            await fetchQRCodes();
        } catch (error) {
            console.error("Failed to delete QR Code", error);
        } finally {
            setShowDeleteModal(false);
            setItemToDelete({ id: null, name: '' });
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-4xl font-bold mb-2 text-foreground">QR Code Generator & Reader</h1>
            <p className="text-muted-foreground mb-8">Create, save, and scan QR codes with ease.</p>

            <Card className="p-0 overflow-hidden">
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setActiveTab('generate')}
                        className={`flex-1 p-4 font-semibold text-center transition-colors ${activeTab === 'generate' ? 'bg-primary text-primary-foreground' : 'hover:bg-input text-foreground'}`}
                    >
                        <QrCodeIcon className="h-5 w-5 inline-block mr-2" />
                        Generate
                    </button>
                    <button
                        onClick={() => setActiveTab('read')}
                        className={`flex-1 p-4 font-semibold text-center transition-colors ${activeTab === 'read' ? 'bg-primary text-primary-foreground' : 'hover:bg-input text-foreground'}`}
                    >
                        <DocumentMagnifyingGlassIcon className="h-5 w-5 inline-block mr-2" />
                        Read
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === 'generate' && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <div className="mb-4">
                                        <Label htmlFor="qr-value">Text or URL</Label>
                                        <Input id="qr-value" type="text" value={qrValue} onChange={(e) => setQrValue(e.target.value)} />
                                    </div>
                                    <div className="mb-4">
                                        <Label htmlFor="max-scans">Max Scans (Optional)</Label>
                                        <Input id="max-scans" type="number" value={maxScans} onChange={(e) => setMaxScans(e.target.value)} placeholder="e.g., 50" min="1" />
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="flex-1">
                                            <Label htmlFor="qr-fg-color">Foreground</Label>
                                            <Input id="qr-fg-color" type="color" value={qrFgColor} onChange={(e) => setQrFgColor(e.target.value)} />
                                        </div>
                                        <div className="flex-1">
                                            <Label htmlFor="qr-bg-color">Background</Label>
                                            <Input id="qr-bg-color" type="color" value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-6">
                                        <Button onClick={handleDownload} variant="secondary" className="w-full">Download</Button>
                                        <Button onClick={handleSave} isLoading={isSaving} className="w-full">
                                            Save
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex justify-center items-center p-4 rounded-lg border-2 border-dashed border-border aspect-square">
                                    <QRCodeSVG
                                        ref={qrCodeRef}
                                        value={qrValue}
                                        size={256}
                                        bgColor={qrBgColor}
                                        fgColor={qrFgColor}
                                        level={"L"}
                                        includeMargin={false}
                                    />
                                </div>
                            </div>
                            <QRCodeList
                                qrCodes={savedQRCodes}
                                onDeleteClick={handleDeleteClick}
                                onDisable={handleDisable}
                                onEnable={handleEnable}
                            />
                        </>
                    )}

                    {activeTab === 'read' && (
                        <div>
                            <Dropzone onDrop={handleQrRead} accept={{ 'image/*': [] }} />
                            {readerResult && (
                                <div className="mt-6 bg-green-500/10 p-4 rounded-md">
                                    <h3 className="font-bold text-green-700 dark:text-green-300">Decoded Result:</h3>
                                    <p className="text-foreground font-mono break-all mt-2">{readerResult}</p>
                                </div>
                            )}
                            {readerError && (
                                <div className="mt-6 bg-destructive text-destructive-foreground p-3 rounded-md text-center">
                                    {readerError}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </Card>
            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete.name}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default QRCodeGeneratorPage;
