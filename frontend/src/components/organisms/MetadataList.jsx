// src/components/organisms/MetadataHistoryList.jsx

import React from "react";
import Card from "../atoms/Card";
import ResourceListItem from "../molecules/ResourceListItem";
import { TrashIcon } from "@heroicons/react/24/outline";

const MetadataList = ({ history, onDeleteClick }) => {
    if (!history || history.length === 0) {
        return null;
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-primary-text">
                Recent Inspections
            </h2>
            <div className="space-y-4">
                {history.map((item) => (
                    <ResourceListItem
                        key={item._id}
                        actions={
                            <button
                                onClick={() => onDeleteClick(item._id, "history record")}
                                className="p-2 text-muted-foreground hover:text-destructive rounded-full"
                                title="Delete Record"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        }
                    >
                        <div>
                            <p className="text-primary-text font-medium truncate">
                                {item.sourceFile.filename}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                {new Date(item.createdAt).toLocaleString()}
                            </p>
                        </div>
                    </ResourceListItem>
                ))}
            </div>
        </div>
    );
};

export default MetadataList;
