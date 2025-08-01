// src/pages/VoiceToTextPage.jsx

import React, { useState, useCallback, useEffect } from "react";
import Card from "../components/atoms/Card";
import Button from "../components/atoms/Button";
import { useSpeechRecognition } from "../hooks/useSpeechRecognition";
import {
    MicrophoneIcon,
    StopCircleIcon,
    ArrowUpOnSquareIcon,
    ClipboardDocumentIcon,
} from "@heroicons/react/24/solid";
import Dropzone from "../components/molecules/Dropzone";
import Spinner from "../components/atoms/Spinner";
import { audioService } from "../services/audioService";
import ConfirmDeleteModal from "../components/organisms/ConfirmDeleteModal";
import AudioHistoryList from "../components/organisms/AudioHistoryList";
import { OPERATION_STATUSES, POLLING_INTERVAL_MS } from "../constants";

const POLLING_INTERVAL = POLLING_INTERVAL_MS;

const VoiceToTextPage = () => {
    const [activeTab, setActiveTab] = useState("realtime");
    const {
        isListening,
        transcript,
        error: speechError,
        startListening,
        stopListening,
        hasSupport,
    } = useSpeechRecognition();

    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle");
    const [taskId, setTaskId] = useState(null);
    const [resultText, setResultText] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [history, setHistory] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ id: null, name: "" });
    const [isDeleting, setIsDeleting] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchHistory = useCallback(async () => {
        try {
            const response = await audioService.getHistory();
            setHistory(response.data.history);
        } catch (error) {
            console.error("Could not fetch transcription history");
        }
    }, []);

    useEffect(() => {
        if (activeTab === "file") {
            fetchHistory();
        }
    }, [activeTab, fetchHistory]);

    useEffect(() => {
        let interval;
        if (status === OPERATION_STATUSES.PROCESSING && taskId) {
            interval = setInterval(async () => {
                try {
                    const { data } = await audioService.checkJobStatus(taskId);
                    if (data.status === OPERATION_STATUSES.COMPLETED) {
                        setStatus(OPERATION_STATUSES.SUCCESS);
                        setResultText(data.resultText);
                        await fetchHistory();
                        clearInterval(interval);
                    } else if (data.status === OPERATION_STATUSES.FAILED) {
                        setStatus(OPERATION_STATUSES.ERROR);
                        setErrorMessage(data.errorMessage || "Transcription failed.");
                        clearInterval(interval);
                    }
                } catch (error) {
                    setStatus(OPERATION_STATUSES.ERROR);
                    setErrorMessage("Could not retrieve job status.");
                    clearInterval(interval);
                }
            }, POLLING_INTERVAL);
        }
        return () => clearInterval(interval);
    }, [status, taskId, fetchHistory]);

    const handleDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setStatus("idle");
            setResultText("");
            setErrorMessage("");
        }
    }, []);

    const handleTranscribeFile = async () => {
        if (!file) return;
        setStatus(OPERATION_STATUSES.PROCESSING);
        try {
            const data = await audioService.uploadForTranscription(file);
            setTaskId(data.taskId);
        } catch (err) {
            setStatus(OPERATION_STATUSES.ERROR);
            setErrorMessage(err.response?.data?.message || "Upload failed.");
        }
    };

    const copyToClipboard = (textToCopy) => {
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDeleteClick = (id, name) => {
        setItemToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete.id) return;
        setIsDeleting(true);
        try {
            await audioService.delete(itemToDelete.id);
            await fetchHistory();
        } catch (error) {
            console.error("Failed to delete transcription", error);
        } finally {
            setShowDeleteModal(false);
            setItemToDelete({ id: null, name: "" });
            setIsDeleting(false);
        }
    };

    const renderFileStatus = () => {
        switch (status) {
            case OPERATION_STATUSES.PROCESSING:
                return (
                    <div className="flex flex-col items-center gap-4 py-10">
                        <Spinner />
                        <p className="text-muted-foreground animate-pulse">
                            Transcribing audio...
                        </p>
                    </div>
                );
            case OPERATION_STATUSES.SUCCESS:
                return (
                    <div>
                        <h3 className="text-xl font-bold text-foreground">
                            Transcription Result
                        </h3>
                        <div className="mt-4 p-4 bg-input border border-border rounded-xl max-h-60 overflow-y-auto">
                            <p className="text-foreground whitespace-pre-wrap">
                                {resultText}
                            </p>
                        </div>
                        <div className="mt-4 flex justify-between">
                            <Button onClick={() => setStatus("idle")} variant="ghost">
                                Transcribe another file
                            </Button>
                            <Button onClick={() => copyToClipboard(resultText)}>
                                <ClipboardDocumentIcon className="h-5 w-5 mr-2" />
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </div>
                    </div>
                );
            case OPERATION_STATUSES.ERROR:
                return (
                    <div className="mt-6 text-center bg-destructive/10 p-4 rounded-xl">
                        <p className="text-destructive font-bold">{errorMessage}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-4xl font-bold mb-2 text-foreground">Voice to Text</h1>
            <p className="text-muted-foreground mb-8">
                Transcribe speech from your microphone or an audio file.
            </p>

            <Card className="p-0 overflow-hidden">
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setActiveTab("realtime")}
                        className={`flex-1 p-4 font-semibold text-center transition-colors flex justify-center items-center ${activeTab === "realtime"
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-input text-foreground"
                            }`}
                    >
                        <MicrophoneIcon className="h-5 w-5 mr-2" /> Real-time
                    </button>
                    <button
                        onClick={() => setActiveTab("file")}
                        className={`flex-1 p-4 font-semibold text-center transition-colors flex justify-center items-center ${activeTab === "file"
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-input text-foreground"
                            }`}
                    >
                        <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" /> Upload File
                    </button>
                </div>

                <div className="p-8">
                    {activeTab === "realtime" && (
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">
                                Real-time Transcription
                            </h2>
                            {!hasSupport ? (
                                <div className="p-4 bg-destructive/10 text-destructive text-center rounded-xl animate-fadeIn">
                                    Speech recognition is not supported in your browser.
                                </div>
                            ) : (
                                <>
                                    <div className="w-full h-64 p-4 bg-input border border-border rounded-xl overflow-y-auto">
                                        <p className="whitespace-pre-wrap">{transcript || <span className="text-muted-foreground">Press "Start Listening" to begin...</span>}</p>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            {!isListening ? (
                                                <Button onClick={startListening}>
                                                    <MicrophoneIcon className="h-5 w-5 mr-2" /> Start Listening
                                                </Button>
                                            ) : (
                                                <Button onClick={stopListening} variant="destructive">
                                                    <StopCircleIcon className="h-5 w-5 mr-2" /> Stop Listening
                                                </Button>
                                            )}
                                        </div>
                                        <Button onClick={() => copyToClipboard(transcript)} disabled={!transcript} variant="ghost">
                                            <ClipboardDocumentIcon className="h-5 w-5 mr-2" /> {copied ? 'Copied!' : 'Copy'}
                                        </Button>
                                    </div>
                                    {isListening && <p className="text-center text-primary animate-pulse mt-2">Listening...</p>}
                                    {speechError && <p className="text-destructive mt-2">{speechError}</p>}
                                </>
                            )}
                        </div>
                    )}
                    {activeTab === "file" && (
                        <div>
                            <h2 className="text-2xl font-semibold text-foreground mb-4">
                                Transcribe Audio File
                            </h2>
                            {status === "idle" ? (
                                <>
                                    <Dropzone onDrop={handleDrop} accept={{ "audio/*": [] }} />
                                    {file && (
                                        <div className="mt-6 text-center animate-fadeIn">
                                            <p className="text-foreground">
                                                Selected:{" "}
                                                <span className="font-medium">{file.name}</span>
                                            </p>
                                            <Button onClick={handleTranscribeFile} isLoading={status === OPERATION_STATUSES.PROCESSING} className="mt-4">
                                                Transcribe File
                                            </Button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                renderFileStatus()
                            )}
                            <AudioHistoryList
                                history={history}
                                onDeleteClick={handleDeleteClick}
                            />
                        </div>
                    )}
                </div>
            </Card>

            <ConfirmDeleteModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete.name}
                isLoading={isDeleting}
            />
        </div>
    );
};
export default VoiceToTextPage;
