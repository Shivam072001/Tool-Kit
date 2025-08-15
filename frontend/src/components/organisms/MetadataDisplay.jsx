// src/components/organisms/MetadataDisplay.jsx

import React from "react";
import Card from "../atoms/Card";

const MetadataDisplay = ({ metadata }) => {
    if (!metadata) {
        return null;
    }

    const entries = Object.entries(metadata);

    if (entries.length === 0) {
        return (
            <Card className="mt-8 p-6 text-center">
                <p className="text-muted-foreground">
                    No metadata was found in this file.
                </p>
            </Card>
        );
    }

    return (
        <Card className="mt-8 p-0">
            <h3 className="text-xl font-bold text-primary-text p-6 border-b border-border">
                Extracted Metadata
            </h3>
            <div className="max-h-96 overflow-y-auto">
                <table className="w-full text-sm text-left">
                    <thead className="sticky top-0 bg-card">
                        <tr>
                            <th className="px-6 py-3 font-semibold text-primary-text">
                                Property
                            </th>
                            <th className="px-6 py-3 font-semibold text-primary-text">Value</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {entries.map(([key, value]) => (
                            <tr key={key}>
                                <td className="px-6 py-4 font-mono text-muted-foreground break-all">
                                    {key}
                                </td>
                                <td className="px-6 py-4 font-mono text-primary-text break-all">
                                    {String(value)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default MetadataDisplay;
