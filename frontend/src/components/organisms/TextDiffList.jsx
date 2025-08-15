// src/components/organisms/TextDiffHistoryList.jsx

import React from 'react';
import Card from '../atoms/Card';
import ResourceListItem from '../molecules/ResourceListItem';
import { TrashIcon } from '@heroicons/react/24/outline';

const TextDiffList = ({ history, onLoad, onDeleteClick }) => {
    if (!history || history.length === 0) {
        return (
            <Card className="p-8 mt-8 text-center">
                <p className="text-muted-foreground">Your recent comparisons will appear here.</p>
            </Card>
        );
    }

    const truncate = (text, length) => text.length > length ? text.substring(0, length) + '...' : text;

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-primary-text">Recent Diffs</h2>
            <div className="space-y-4">
                {history.map((item) => (
                    <ResourceListItem
                        key={item._id}
                        actions={
                            <button
                                onClick={() => onDeleteClick(item._id, 'diff record')}
                                className="p-2 text-muted-foreground hover:text-destructive rounded-full"
                                title="Delete record"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        }
                    >
                        <button onClick={() => onLoad(item.originalText, item.changedText)} className="text-left w-full">
                            <p className="text-primary-text font-mono text-sm">
                                <strong>Original:</strong> {truncate(item.originalText, 50)}
                            </p>
                            <p className="text-muted-foreground font-mono text-sm">
                                <strong>Changed:</strong> {truncate(item.changedText, 50)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {new Date(item.createdAt).toLocaleString()}
                            </p>
                        </button>
                    </ResourceListItem>
                ))}
            </div>
        </div>
    );
};

export default TextDiffList;