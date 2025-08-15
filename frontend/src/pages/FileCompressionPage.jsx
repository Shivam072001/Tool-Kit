import React, { useState, useCallback, useEffect } from "react";
import { fileService } from "../services/fileService";
import Dropzone from "../components/molecules/Dropzone";
import Card from "../components/atoms/Card";
import Button from "../components/atoms/Button";
import Spinner from "../components/atoms/Spinner";
import {
    CheckCircleIcon,
    XCircleIcon,
    DocumentArrowDownIcon,
} from "@heroicons/react/24/solid";
import { OPERATION_STATUSES } from "../constants";
import { useTaskPoller } from "../hooks/useTaskPoller";

const acceptedFiles = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/webp": [".webp"],
    "application/pdf": [".pdf"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
        ".docx",
    ],
};

const FileCompressorPage = () => {
    const [file, setFile] = useState(null);
    const [uiStatus, setUiStatus] = useState("idle");
    const [progress, setProgress] = useState(0);
    const [taskId, setTaskId] = useState(null);

    const {
        status: taskStatus,
        result: resultUrl,
        errorMessage,
        setStatus: setTaskStatus,
    } = useTaskPoller(taskId, fileService.checkJobStatus);

    useEffect(() => {
        if (
            taskStatus === OPERATION_STATUSES.SUCCESS ||
            taskStatus === OPERATION_STATUSES.ERROR
        ) {
            setUiStatus(taskStatus);
        }
    }, [taskStatus]);

    const handleDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setUiStatus("idle");
            setProgress(0);
            setTaskId(null);
        }
    }, []);

    const handleUpload = async () => {
        if (!file) return;
        setUiStatus("uploading");
        try {
            const data = await fileService.uploadForCompression(file, (e) =>
                setProgress(Math.round((100 * e.loaded) / e.total))
            );
            setTaskId(data.taskId);
            setUiStatus(OPERATION_STATUSES.PROCESSING);
        } catch (err) {
            setUiStatus(OPERATION_STATUSES.ERROR);
            setTaskStatus(OPERATION_STATUSES.ERROR);
        }
    };

    const handleReset = () => {
        setFile(null);
        setUiStatus("idle");
        setProgress(0);
        setTaskId(null);
    };

    const renderStatus = () => {
        switch (uiStatus) {
            case "uploading":
                return (
                    <div className="mt-6">
                        <p className="text-center text-primary-text mb-2">
                            Uploading: {progress}%
                        </p>
                        <div className="w-full bg-border rounded-full h-2.5">
                            <div
                                className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                );
            case OPERATION_STATUSES.PROCESSING:
                return (
                    <div className="mt-6 flex flex-col items-center gap-4 py-10">
                        <Spinner />
                        <p className="text-muted-foreground animate-pulse">
                            Processing... Please wait.
                        </p>
                    </div>
                );
            case OPERATION_STATUSES.SUCCESS:
                return (
                    <div className="mt-6 text-center bg-primary/10 p-6 rounded-xl animate-fadeIn">
                        <CheckCircleIcon className="h-12 w-12 text-primary mx-auto mb-4" />
                        <p className="text-primary font-bold mb-4">Compression Complete!</p>
                        <a
                            href={resultUrl}
                            download
                            className="inline-flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground font-bold rounded-full hover:opacity-90 transition-colors"
                        >
                            <DocumentArrowDownIcon className="h-5 w-5" />
                            Download Compressed File
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
    };

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-4xl font-bold mb-2 text-primary-text">
                File Compressor
            </h1>
            <p className="text-muted-foreground mb-8">
                Reduce file sizes for images, PDFs, and documents.
            </p>

            <Card className="p-8">
                {uiStatus === "idle" ? (
                    <>
                        <Dropzone onDrop={handleDrop} accept={acceptedFiles} />
                        {file && (
                            <div className="mt-6 text-center">
                                <p className="text-primary-text">
                                    Selected: <span className="font-medium">{file.name}</span>
                                </p>
                                <Button onClick={handleUpload} className="mt-4">
                                    Compress File
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    renderStatus()
                )}

                {uiStatus !== "idle" && (
                    <div className="mt-6 text-center">
                        <Button onClick={handleReset} variant="ghost">
                            Start Over
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default FileCompressorPage;
