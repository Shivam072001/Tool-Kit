import React, { useState, useCallback, useEffect } from 'react';
import { fileService } from '../services/fileService';
import Dropzone from '../components/molecules/Dropzone';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import { OPERATION_STATUSES, POLLING_INTERVAL_MS, RESPONSE_STATUS } from '../constants';
import { config } from '../config/env';

const POLLING_INTERVAL = POLLING_INTERVAL_MS;

const acceptedFiles = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/webp': ['.webp'],
    'application/pdf': ['.pdf'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

const FileCompressorPage = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [progress, setProgress] = useState(0);
    const [taskId, setTaskId] = useState(null);
    const [resultUrl, setResultUrl] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        let intervalId;
        if (status === OPERATION_STATUSES.PROCESSING && taskId) {
            intervalId = setInterval(async () => {
                try {
                    const data = await fileService.checkJobStatus(taskId);
                    if (data.status === RESPONSE_STATUS.SUCCESS) {
                        setStatus(OPERATION_STATUSES.SUCCESS);
                        setResultUrl(`${config.computeServiceUrl}/media/${data.result}`);
                        clearInterval(intervalId);
                    } else if (data.status === RESPONSE_STATUS.FAILURE) {
                        setStatus(OPERATION_STATUSES.ERROR);
                        setErrorMessage(data.error || 'Compression failed on the server.');
                        clearInterval(intervalId);
                    }
                } catch (err) {
                    setStatus(OPERATION_STATUSES.ERROR);
                    setErrorMessage('Could not retrieve job status.');
                    clearInterval(intervalId);
                }
            }, POLLING_INTERVAL);
        }
        return () => clearInterval(intervalId);
    }, [status, taskId]);

    const handleDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setStatus('idle');
            setErrorMessage('');
            setProgress(0);
            setResultUrl(null);
        }
    }, [])


    const handleUpload = async () => {
        if (!file) return;
        setStatus('uploading');
        try {
            const data = await fileService.uploadForCompression(file, (e) => setProgress(Math.round((100 * e.loaded) / e.total)));
            setTaskId(data.taskId);
            setStatus(OPERATION_STATUSES.PROCESSING);
        } catch (err) {
            setStatus(OPERATION_STATUSES.ERROR);
            setErrorMessage(err.response?.data?.message || 'Upload failed.');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-foreground">File Compressor</h1>
            <p className="text-muted-foreground mb-8">Reduce file sizes for images, PDFs, and documents.</p>

            <Card className="p-8">
                <Dropzone onDrop={handleDrop} accept={acceptedFiles} />

                {file && !resultUrl && (
                    <div className="mt-6 text-center">
                        <p className="text-foreground">Selected: <span className="font-medium">{file.name}</span></p>
                        <Button onClick={handleUpload} disabled={status !== 'idle'} className="mt-4">
                            Compress File
                        </Button>
                    </div>
                )}

                {status === 'uploading' && (
                    <div className="mt-6">
                        <p className="text-center text-foreground mb-2">Uploading: {progress}%</p>
                        <div className="w-full bg-border rounded-full h-2.5">
                            <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                )}

                {status === OPERATION_STATUSES.PROCESSING && (
                    <p className="mt-6 text-center text-foreground animate-pulse">Processing... Please wait.</p>
                )}

                {status === OPERATION_STATUSES.SUCCESS && resultUrl && (
                    <div className="mt-6 text-center bg-green-500/10 p-4 rounded-md">
                        <p className="text-green-500 font-bold mb-4">Compression Complete!</p>
                        <a href={resultUrl} download className="px-6 py-2 bg-secondary text-primary-foreground rounded-md hover:opacity-90">
                            Download Compressed File
                        </a>
                        <button onClick={() => setFile(null)} className="ml-4 text-muted-foreground hover:text-foreground">Start Over</button>
                    </div>
                )}

                {status === OPERATION_STATUSES.ERROR && (
                    <div className="mt-6 bg-destructive text-destructive-foreground p-3 rounded-md text-center">
                        {errorMessage}
                    </div>
                )}
            </Card>
        </div >
    );
};

export default FileCompressorPage;