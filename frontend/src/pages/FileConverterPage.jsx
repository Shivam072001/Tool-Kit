// src/pages/FileConverterPage.jsx

import React, { useState, useCallback, useEffect } from 'react';
import { fileService } from '../services/fileService';
import Dropzone from '../components/molecules/Dropzone';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import { CheckCircleIcon, XCircleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import Label from '../components/atoms/Label';
import { OPERATION_STATUSES } from '../constants';
import { useTaskPoller } from '../hooks/useTaskPoller';

const FileConverterPage = () => {
    const [file, setFile] = useState(null);
    const [taskId, setTaskId] = useState(null);
    const [outputFormat, setOutputFormat] = useState('');
    const [possibleConversions, setPossibleConversions] = useState([]);
    const [conversionMap, setConversionMap] = useState({});
    const [acceptedFiles, setAcceptedFiles] = useState({});
    const { status, result: resultUrl, errorMessage, setStatus } = useTaskPoller(taskId, fileService.checkJobStatus);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fileService.getConversionOptions();
                const fetchedMap = response.data.conversionMap;
                setConversionMap(fetchedMap);
                const accept = Object.keys(fetchedMap).reduce((acc, mime) => {
                    acc[mime] = [];
                    return acc;
                }, {});
                setAcceptedFiles(accept);
            } catch (err) {
                setStatus(OPERATION_STATUSES.ERROR);
            }
        };
        fetchOptions();
    }, [setStatus]);

    const handleDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            const conversions = conversionMap[selectedFile.type] || [];
            setPossibleConversions(conversions);
            setOutputFormat(conversions[0] || '');
            setStatus('idle');
            setTaskId(null);
        }
    }, [conversionMap, setStatus]);

    const handleConvert = async () => {
        if (!file || !outputFormat) return;
        setStatus(OPERATION_STATUSES.PROCESSING);
        try {
            const data = await fileService.uploadForConversion(file, outputFormat);
            setTaskId(data.taskId);
        } catch (err) {
            setStatus(OPERATION_STATUSES.ERROR);
        }
    };

    const renderStatus = () => {
        switch (status) {
            case OPERATION_STATUSES.PROCESSING:
                return (
                    <div className="mt-6 flex flex-col items-center gap-4 py-10">
                        <Spinner />
                        <p className="text-muted-foreground animate-pulse">Your file is being converted. Please wait...</p>
                    </div>
                );
            case OPERATION_STATUSES.SUCCESS:
                return (
                    <div className="mt-6 text-center bg-primary/10 p-6 rounded-xl animate-fadeIn">
                        <CheckCircleIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                        <p className="text-primary font-bold mb-4">Conversion Complete!</p>
                        <a href={resultUrl} download className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-full hover:opacity-90">
                            <DocumentArrowDownIcon className="h-5 w-5" />
                            Download Result
                        </a>
                    </div>
                );
            case OPERATION_STATUSES.ERROR:
                return (
                    <div className="mt-6 text-center bg-destructive/10 p-6 rounded-xl animate-fadeIn">
                        <XCircleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <p className="text-destructive font-bold">An Error Occurred</p>
                        <p className="text-destructive/80 text-sm">{errorMessage}</p>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-4xl font-bold mb-2 text-primary-text">File Converter</h1>
            <p className="text-muted-foreground mb-8">Convert your files from one format to another with a single click.</p>

            <Card className="p-8">
                <div className="border-b border-border pb-6 mb-6">
                    <h2 className="text-2xl font-semibold text-primary-text">Select File and Conversion</h2>
                </div>

                {status === 'idle' ? (
                    <>
                        <Dropzone onDrop={handleDrop} accept={acceptedFiles} />
                        {file && (
                            <div className="mt-6 text-center">
                                <p className="text-primary-text">Selected: <span className="font-medium">{file.name}</span></p>
                                {possibleConversions.length > 0 && (
                                    <div className="mt-4">
                                        <Label htmlFor="output-format" className="text-muted-foreground mr-2">Convert to:</Label>
                                        <select
                                            id="output-format"
                                            value={outputFormat}
                                            onChange={(e) => setOutputFormat(e.target.value)}
                                            className="mt-1 block w-full sm:w-auto mx-auto px-3 py-2 bg-input border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                            {possibleConversions.map(format => (
                                                <option key={format} value={format}>{format}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                <Button onClick={handleConvert} disabled={!outputFormat} className="mt-4">
                                    Convert
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    renderStatus()
                )}

                {(status === OPERATION_STATUSES.SUCCESS || status === OPERATION_STATUSES.ERROR) && (
                    <div className="mt-6 text-center">
                        <Button onClick={() => handleDrop([])} variant="ghost">Convert another file</Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default FileConverterPage;