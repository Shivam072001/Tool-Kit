// src/components/organisms/RegexHistoryList.jsx

import React from 'react';
import Card from '../atoms/Card';
import ResourceListItem from '../molecules/ResourceListItem';
import { TrashIcon } from '@heroicons/react/24/outline';

const RegexList = ({ history, onLoad, onDeleteClick }) => {
    if (!history || history.length === 0) {
        return (
            <Card className="p-8 mt-8 text-center">
                <p className="text-muted-foreground">Your saved patterns will appear here.</p>
            </Card>
        );
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Saved Patterns</h2>
            <div className="space-y-4">
                {history.map((item) => (
                    <ResourceListItem
                        key={item._id}
                        actions={
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteClick(item._id, 'pattern'); }}
                                className="p-2 text-muted-foreground hover:text-destructive rounded-full"
                                title="Delete Pattern"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        }
                    >
                        <button
                            onClick={() => onLoad(item)}
                            className="text-left w-full"
                        >
                            <p className="font-semibold text-foreground">{item.name}</p>
                            <p className="font-mono text-sm text-primary mt-1">
                                /{item.pattern}/{item.flags}
                            </p>
                        </button>
                    </ResourceListItem>
                ))}
            </div>
        </div>
    );
};

export default RegexList;