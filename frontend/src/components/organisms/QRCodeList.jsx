// src/components/organisms/QRCodeList.jsx

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import ResourceListItem from '../molecules/ResourceListItem';
import { TrashIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline';

const QRCodeList = ({ qrCodes, onDeleteClick, onDisable, onEnable }) => {
    if (!qrCodes || qrCodes.length === 0) {
        return (
            <Card className="p-8 mt-8 text-center">
                <p className="text-muted-foreground">You haven't saved any QR codes yet.</p>
            </Card>
        );
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Your Saved QR Codes</h2>
            <div className="space-y-4">
                {qrCodes.map((code) => {
                    // The value for the QR code is now the tracking URL
                    const trackingUrl = `${window.location.origin}/${code._id}?redirect=qr`;
                    const isDisabled = code.disabled;

                    return (
                        <ResourceListItem
                            key={code._id}
                            actions={
                                <>
                                    <span className={`font-mono text - sm px - 2 py - 1 rounded - md ${isDisabled ? 'bg-border text-muted-foreground' : 'bg-border text-foreground'} `}>
                                        Scans: {code.scans} / {code.maxScans || '∞'}
                                    </span>
                                    {isDisabled ? (
                                        <Button onClick={() => onEnable(code._id)} variant="ghost" className="p-2" title="Re-enable QR Code">
                                            <PlayIcon className="h-5 w-5 text-green-500" />
                                        </Button>
                                    ) : (
                                        <Button onClick={() => onDisable(code._id)} variant="ghost" className="p-2" title="Disable QR Code">
                                            <StopIcon className="h-5 w-5 text-yellow-500" />
                                        </Button>
                                    )}
                                    <button onClick={() => onDeleteClick(code._id, 'QR Code')} className="p-2 text-muted-foreground hover:text-destructive rounded-full" title="Delete QR Code">
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </>
                            }
                        >
                            <div className={`flex items - center gap - 4 ${isDisabled ? 'opacity-50' : ''} `}>
                                <div className="bg-white p-2 rounded-md border border-border flex-shrink-0">
                                    <QRCodeSVG
                                        value={trackingUrl} // Use tracking URL here
                                        size={64}
                                        bgColor={code.backgroundColor}
                                        fgColor={code.foregroundColor}
                                        level={"L"}
                                        includeMargin={false}
                                    />
                                </div>
                                <p className="text-sm text-foreground break-all">{code.value}</p>
                            </div>
                        </ResourceListItem>
                    );
                })}
            </div>
        </div>
    );
};

export default QRCodeList;