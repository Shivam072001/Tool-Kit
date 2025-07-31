// src/pages/FileConverterPage.jsx

import React, { useState, useCallback, useEffect } from 'react';
import { fileService } from '../services/fileService';
import Dropzone from '../components/molecules/Dropzone';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import { CheckCircleIcon, XCircleIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';
import { OPERATION_STATUSES, POLLING_INTERVAL_MS } from '../constants';

const POLLING_INTERVAL = POLLING_INTERVAL_MS;

const FileConverterPage = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [taskId, setTaskId] = useState(null);
    const [resultUrl, setResultUrl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [outputFormat, setOutputFormat] = useState('');
    const [possibleConversions, setPossibleConversions] = useState([]);

    // State for the dynamically fetched conversion options
    const [conversionMap, setConversionMap] = useState({});
    const [acceptedFiles, setAcceptedFiles] = useState({});

    // Fetch conversion options when the component mounts
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fileService.getConversionOptions();
                const fetchedMap = response.data.conversionMap;
                setConversionMap(fetchedMap);
                // Generate the 'accept' object for the Dropzone from the keys of the map
                const accept = Object.keys(fetchedMap).reduce((acc, mime) => {
                    acc[mime] = []; // We don't need to specify extensions here
                    return acc;
                }, {});
                setAcceptedFiles(accept);
            } catch (err) {
                setErrorMessage('Could not load conversion options from the server.');
                setStatus(OPERATION_STATUSES.ERROR);
            }
        };
        fetchOptions();
    }, []);

    // Polling logic remains the same
    useEffect(() => {
        let interval;
        if (status === OPERATION_STATUSES.PROCESSING && taskId) {
            interval = setInterval(async () => {
                try {
                    const data = await fileService.checkJobStatus(taskId);
                    if (data.status === OPERATION_STATUSES.COMPLETED) {
                        setStatus(OPERATION_STATUSES.SUCCESS);
                        setResultUrl(data.resultUrl);
                        clearInterval(interval);
                    } else if (data.status === OPERATION_STATUSES.FAILED) {
                        setStatus(OPERATION_STATUSES.ERROR);
                        setErrorMessage(data.errorMessage || 'Conversion failed.');
                        clearInterval(interval);
                    }
                } catch (err) {
                    setStatus(OPERATION_STATUSES.ERROR);
                    setErrorMessage('Could not retrieve job status.');
                    clearInterval(interval);
                }
            }, POLLING_INTERVAL);
        }
        return () => clearInterval(interval);
    }, [status, taskId]);

    const handleDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            setFile(selectedFile);
            // Use the fetched conversionMap to determine possible conversions
            const conversions = conversionMap[selectedFile.type] || [];
            setPossibleConversions(conversions);
            setOutputFormat(conversions[0] || '');
            setStatus('idle');
            setErrorMessage('');
            setResultUrl(null);
            setTaskId(null);
        }
    }, [conversionMap]); // Add conversionMap as a dependency

    const handleConvert = async () => {
        if (!file || !outputFormat) return;
        setStatus(OPERATION_STATUSES.PROCESSING);
        try {
            const data = await fileService.uploadForConversion(file, outputFormat);
            setTaskId(data.taskId);
        } catch (err) {
            setStatus(OPERATION_STATUSES.ERROR);
            setErrorMessage(err.response?.data?.message || 'Upload failed.');
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
                    <div className="mt-6 text-center bg-green-500/10 p-6 rounded-lg">
                        <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                        <p className="text-green-700 dark:text-green-300 font-bold mb-4">Conversion Complete!</p>
                        <a href={resultUrl} download className="inline-flex items-center gap-2 px-6 py-2 bg-secondary text-primary-foreground rounded-md hover:opacity-90">
                            <DocumentArrowDownIcon className="h-5 w-5" />
                            Download Result
                        </a>
                    </div>
                );
            case OPERATION_STATUSES.ERROR:
                return (
                    <div className="mt-6 text-center bg-destructive/10 p-6 rounded-lg">
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
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-foreground">File Converter</h1>
            <p className="text-muted-foreground mb-8">Convert your files from one format to another with a single click.</p>

            <Card className="p-8">
                <div className="border-b border-border pb-6 mb-6">
                    <h2 className="text-2xl font-semibold text-foreground">Select File and Conversion</h2>
                </div>

                {status === 'idle' ? (
                    <>
                        <Dropzone onDrop={handleDrop} accept={acceptedFiles} />
                        {file && (
                            <div className="mt-6 text-center">
                                <p className="text-foreground">Selected: <span className="font-medium">{file.name}</span></p>
                                {possibleConversions.length > 0 && (
                                    <div className="mt-4">
                                        <label htmlFor="output-format" className="text-muted-foreground mr-2">Convert to:</label>
                                        <select
                                            id="output-format"
                                            value={outputFormat}
                                            onChange={(e) => setOutputFormat(e.target.value)}
                                            className="bg-input border border-border rounded-md px-2 py-1"
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