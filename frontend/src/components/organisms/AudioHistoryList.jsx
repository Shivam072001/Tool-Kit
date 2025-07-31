// src/components/organisms/AudioHistoryList.jsx
import React from 'react';
import Card from '../atoms/Card';
import ResourceListItem from '../molecules/ResourceListItem';
import { TrashIcon } from '@heroicons/react/24/outline';

const AudioHistoryList = ({ history, onDeleteClick }) => {
    if (!history || history.length === 0) {
        return (
            <Card className="p-8 mt-8 text-center">
                <p className="text-muted-foreground">Your recent transcriptions will appear here.</p>
            </Card>
        );
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Recent Transcriptions</h2>
            <div className="space-y-4">
                {history.map((item) => (
                    <ResourceListItem
                        key={item._id}
                        actions={
                            <button
                                onClick={() => onDeleteClick(item._id, 'transcription record')}
                                className="p-2 text-muted-foreground hover:text-destructive rounded-full"
                                title="Delete record"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        }
                    >
                        <p className="text-foreground font-medium truncate">
                            {item.source.filename}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {new Date(item.createdAt).toLocaleString()}
                        </p>
                    </ResourceListItem>
                ))}
            </div>
        </div>
    );
};
export default AudioHistoryList;