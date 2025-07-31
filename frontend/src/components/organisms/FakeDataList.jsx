// src/components/organisms/FakeDataHistoryList.jsx

import React from 'react';
import Card from '../atoms/Card';
import ResourceListItem from '../molecules/ResourceListItem';
import { TrashIcon } from '@heroicons/react/24/outline';

const FakeDataList = ({ history, onDeleteClick, onHistoryClick }) => {
    if (!history || history.length === 0) {
        return (
            <Card className="p-8 mt-8 text-center">
                <p className="text-muted-foreground">Your generation history will appear here.</p>
            </Card>
        );
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Recent Generations</h2>
            <div className="space-y-4">
                {history.map((item) => (
                    <ResourceListItem
                        key={item._id}
                        actions={
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteClick(item._id, 'history record'); }}
                                className="p-2 text-muted-foreground hover:text-destructive rounded-full"
                                title="Delete Record"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        }
                    >
                        <button
                            onClick={() => onHistoryClick(item)}
                            className="w-full text-left"
                        >
                            <p className="font-semibold text-foreground capitalize">
                                {item.count} rows of {item.dataType} data
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Locale: {item.locale} &middot; {new Date(item.createdAt).toLocaleString()}
                            </p>
                        </button>
                    </ResourceListItem>
                ))}
            </div>
        </div>
    );
};
export default FakeDataList;