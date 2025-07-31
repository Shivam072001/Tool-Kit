// src/components/organisms/CurrencyConversionList.jsx

import React from "react";
import Card from "../atoms/Card";
import ResourceListItem from "../molecules/ResourceListItem";

const CurrencyConversionList = ({ history, onDeleteClick }) => {
    if (!history || history.length === 0) {
        return (
            <Card className="p-8 mt-8 text-center">
                <p className="text-muted-foreground">
                    Your recent conversions will appear here.
                </p>
            </Card>
        );
    }

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
                Recent Conversions
            </h2>
            <div className="space-y-4">
                {history.map((item) => (
                    <ResourceListItem
                        key={item._id}
                        actions={
                            <button
                                onClick={() => onDeleteClick(item._id, "conversion record")}
                                className="p-2 text-muted-foreground hover:text-destructive rounded-full"
                                title="Delete record"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        }
                    >
                        <div className="flex items-center justify-between w-full">
                            <div>
                                <p className="text-foreground">
                                    <span className="font-bold">{item.amount}</span>{" "}
                                    {item.fromCurrency}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {new Date(item.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <p className="text-lg font-bold text-primary text-right">
                                {item.result.toFixed(4)} {item.toCurrency}
                            </p>
                        </div>
                    </ResourceListItem>
                ))}
            </div>
        </div>
    );
};

export default CurrencyConversionList;
