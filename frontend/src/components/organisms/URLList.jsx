import React from 'react';
import Card from '../atoms/Card';
import ResourceListItem from '../molecules/ResourceListItem';
import Button from '../atoms/Button';
import { ClipboardDocumentIcon, TrashIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline';

const URLList = ({ urls, onDeleteClick, onDisable, onEnable }) => {

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (!urls || urls.length === 0) {
        return (
            <Card className="p-8 mt-8 text-center">
                <p className="text-muted-foreground">You haven't shortened any links yet. Add one above to get started!</p>
            </Card>
        );
    }

    return (
        <div className="mt-8 space-y-4">
            {urls.map((url) => {
                const fullShortUrl = `${window.location.origin}/${url.shortCode}`;
                const isDisabled = url.disabled || (url.expiresAt && new Date() > new Date(url.expiresAt));

                return (
                    <ResourceListItem
                        key={url._id}
                        actions={
                            <>
                                <span className={`font-mono text-sm px-2 py-1 rounded-md ${isDisabled ? 'bg-border text-muted-foreground' : 'bg-border text-foreground'}`}>
                                    Clicks: {url.clicks} / {url.maxClicks || '∞'}
                                </span>
                                <button onClick={() => copyToClipboard(fullShortUrl)} className="p-2 text-muted-foreground hover:text-foreground hover:bg-border rounded-full" title="Copy to clipboard">
                                    <ClipboardDocumentIcon className="h-5 w-5" />
                                </button>

                                {isDisabled ? (
                                    <Button onClick={() => onEnable(url._id)} variant="ghost" className="p-2" title="Re-enable Link">
                                        <PlayIcon className="h-5 w-5 text-green-500" />
                                    </Button>
                                ) : (
                                    <Button onClick={() => onDisable(url._id)} variant="ghost" className="p-2" title="Disable Link">
                                        <StopIcon className="h-5 w-5 text-yellow-500" />
                                    </Button>
                                )}

                                <button onClick={() => onDeleteClick(url._id, 'URL')} className="p-2 text-muted-foreground hover:text-destructive rounded-full" title="Delete URL">
                                    <TrashIcon className="h-5 w-5" />
                                </button>
                            </>
                        }
                    >
                        <div className={isDisabled ? 'opacity-50' : ''}>
                            <p className="text-lg font-bold text-foreground">{fullShortUrl}</p>
                            <a
                                href={isDisabled ? undefined : url.originalUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`text-sm text-muted-foreground truncate ${isDisabled ? 'cursor-not-allowed' : 'hover:underline'}`}
                                onClick={(e) => isDisabled && e.preventDefault()}
                            >
                                {url.originalUrl}
                            </a>
                            {url.expiresAt && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Expires: {new Date(url.expiresAt).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </ResourceListItem>
                );
            })}
        </div>
    );
};

export default URLList;