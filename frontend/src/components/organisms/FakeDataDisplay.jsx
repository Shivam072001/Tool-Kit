// src/components/organisms/FakeDataDisplay.jsx

import React from 'react';
import Card from '../atoms/Card';
import Button from '../atoms/Button';
import { DocumentArrowDownIcon } from '@heroicons/react/24/solid';

const FakeDataDisplay = ({ data }) => {
    if (!data || data.length === 0) {
        return null;
    }

    const headers = Object.keys(data[0]);

    // --- Export Functions ---
    const convertToCSV = () => {
        const headerRow = headers.join(',');
        const bodyRows = data.map(row =>
            headers.map(header => `"${String(row[header]).replace(/"/g, '""')}"`).join(',')
        );
        return [headerRow, ...bodyRows].join('\n');
    };

    const handleExport = (format) => {
        let fileContent, fileType, fileName;
        if (format === 'json') {
            fileContent = JSON.stringify(data, null, 2);
            fileType = 'application/json';
            fileName = 'fake_data.json';
        } else { // csv
            fileContent = convertToCSV();
            fileType = 'text/csv';
            fileName = 'fake_data.csv';
        }

        const blob = new Blob([fileContent], { type: fileType });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    return (
        <Card className="mt-8 p-0">
            <div className="flex justify-between items-center p-6 border-b border-border">
                <h3 className="text-xl font-bold text-primary-text">Generated Data</h3>
                <div className="flex gap-2">
                    <Button onClick={() => handleExport('json')} variant="ghost">
                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" /> JSON
                    </Button>
                    <Button onClick={() => handleExport('csv')} variant="ghost">
                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" /> CSV
                    </Button>
                </div>
            </div>
            <div className="max-h-[600px] overflow-auto">
                <table className="w-full text-sm text-left">
                    <thead className="sticky top-0 bg-card">
                        <tr>
                            {headers.map(header => (
                                <th key={header} className="px-6 py-3 font-semibold text-primary-text capitalize">
                                    {header.replace(/_/g, ' ')}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {data.map((row, index) => (
                            <tr key={index}>
                                {headers.map(header => (
                                    <td key={header} className="px-6 py-4 text-muted-foreground break-all">
                                        {String(row[header])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default FakeDataDisplay;