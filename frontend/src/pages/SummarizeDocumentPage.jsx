// frontend/src/pages/DocumentSummarizerPage.jsx

import React, { useState, useCallback } from 'react';
import Dropzone from '../components/molecules/Dropzone';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import { ClipboardDocumentIcon } from '@heroicons/react/24/solid';
import { textService } from '../services/textService';
import { OPERATION_STATUSES } from '../constants';
import { useTaskPoller } from '../hooks/useTaskPoller';

const DocumentSummarizerPage = () => {
    const [file, setFile] = useState(null);
    const [taskId, setTaskId] = useState(null);
    const { status, result: summaryText, errorMessage, setStatus } = useTaskPoller(taskId, textService.checkJobStatus);

    const handleDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setStatus('idle');
            setTaskId(null);
        }
    }, [setStatus]);

    const handleSummarize = async () => {
        if (!file) return;
        setStatus(OPERATION_STATUSES.PROCESSING)
        try {
            const data = await textService.uploadForSummarization(file);
            setTaskId(data.taskId);
        } catch (err) {
            setStatus(OPERATION_STATUSES.ERROR);
        }
    };

    const copyToClipboard = () => {
        if (summaryText) {
            navigator.clipboard.writeText(summaryText);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Document Summarizer</h1>
            <p className="text-muted-foreground mb-8">Get the key points from any document instantly.</p>

            <Card className="p-8">
                <div className="border-b border-border pb-6 mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">Upload Document</h2>
                    <p className="text-muted-foreground mt-1">Supports .txt, .pdf, and .docx files.</p>
                </div>

                {status === 'idle' && (
                    <>
                        <Dropzone onDrop={handleDrop} accept={{ 'text/plain': ['.txt'], 'application/pdf': ['.pdf'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] }} />
                        {file && (
                            <div className="mt-6 text-center">
                                <p className="text-foreground">Selected: <span className="font-medium">{file.name}</span></p>
                                <Button onClick={handleSummarize} className="mt-4">
                                    Summarize Document
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {status === OPERATION_STATUSES.PROCESSING && (
                    <div className="mt-6 flex flex-col items-center gap-4 py-10">
                        <Spinner />
                        <p className="text-muted-foreground animate-pulse">Analyzing document and generating summary...</p>
                    </div>
                )}

                {status === OPERATION_STATUSES.SUCCESS && (
                    <div>
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-foreground">Generated Summary</h3>
                            <Button variant="ghost" onClick={copyToClipboard} className="flex items-center gap-2">
                                <ClipboardDocumentIcon className="h-5 w-5" /> Copy
                            </Button>
                        </div>
                        <div className="mt-4 p-4 bg-input border border-border rounded-lg max-h-96 overflow-y-auto">
                            <p className="text-foreground whitespace-pre-wrap">{summaryText}</p>
                        </div>
                    </div>
                )}

                {status === OPERATION_STATUSES.ERROR && (
                    <div className="mt-6 text-center bg-destructive/10 p-6 rounded-lg">
                        <p className="text-destructive font-bold">An Error Occurred</p>
                        <p className="text-destructive/80 text-sm">{errorMessage}</p>
                    </div>
                )}

                {(status === OPERATION_STATUSES.SUCCESS || status === OPERATION_STATUSES.ERROR) && (
                    <div className="mt-6 text-center">
                        <Button onClick={() => handleDrop([])} variant="ghost">Summarize another document</Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default DocumentSummarizerPage;