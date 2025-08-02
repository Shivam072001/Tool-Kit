// src/pages/BackgroundRemoverPage.jsx

import React, { useState, useCallback, useEffect, useRef } from "react";
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
import Input from "../components/atoms/Input";
import Label from "../components/atoms/Label";
import { OPERATION_STATUSES } from "../constants";
import { useTaskPoller } from "../hooks/useTaskPoller";

const BackgroundRemoverPage = () => {
    const [file, setFile] = useState(null);
    const [taskId, setTaskId] = useState(null);
    const [originalImageUrl, setOriginalImageUrl] = useState(null);
    const [bgColor, setBgColor] = useState('#ffffff');
    const [bgImage, setBgImage] = useState(null);
    const canvasRef = useRef(null);
    const { status, result: resultUrl, errorMessage, setStatus } = useTaskPoller(taskId, fileService.checkJobStatus);

    useEffect(() => {
        if (status === OPERATION_STATUSES.SUCCESS && resultUrl && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            const foreground = new Image();
            foreground.crossOrigin = "anonymous";

            foreground.onload = () => {
                canvas.width = foreground.naturalWidth;
                canvas.height = foreground.naturalHeight;

                if (bgImage) {
                    const background = new Image();
                    background.crossOrigin = "anonymous";
                    background.onload = () => {
                        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
                        ctx.drawImage(foreground, 0, 0);
                    };
                    background.src = URL.createObjectURL(bgImage);
                } else {
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(foreground, 0, 0);
                }
            };
            foreground.src = resultUrl;
        }
    }, [status, resultUrl, bgColor, bgImage]);

    const handleDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            const currentFile = acceptedFiles[0];
            setFile(currentFile);
            setOriginalImageUrl(URL.createObjectURL(currentFile));
            setStatus("idle");
            setTaskId(null);
            setBgImage(null);
        }
    }, [setStatus]);

    const handleBgImageDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setBgImage(acceptedFiles[0]);
        }
    }, []);

    const handleRemoveBackground = async () => {
        if (!file) return;
        setStatus(OPERATION_STATUSES.PROCESSING);
        try {
            const data = await fileService.uploadForBackgroundRemoval(file);
            setTaskId(data.taskId);
        } catch (err) {
            setStatus(OPERATION_STATUSES.ERROR);
        }
    };

    const handleDownload = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const link = document.createElement('a');
            link.download = 'result.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    const handleReset = () => {
        setFile(null);
        setStatus("idle");
        setOriginalImageUrl(null);
        setBgImage(null);
        setBgColor('#ffffff');
        setTaskId(null);
    };

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-4xl font-bold mb-2 text-foreground">
                AI Background Remover
            </h1>
            <p className="text-muted-foreground mb-8">
                Automatically remove the background from any image, then add a new one.
            </p>

            <Card className="p-8">
                {status === "idle" && (
                    <>
                        <Dropzone onDrop={handleDrop} accept={{ 'image/*': [] }} />
                        {file && (
                            <div className="mt-6 text-center animate-fadeIn">
                                <p className="text-foreground">Selected: <span className="font-medium">{file.name}</span></p>
                                <div className="mt-4 flex justify-center">
                                    <img src={originalImageUrl} alt="Original preview" className="max-h-48 rounded-xl shadow-md border border-border" />
                                </div>
                                <Button
                                    onClick={handleRemoveBackground}
                                    className="mt-6"
                                >
                                    Remove Background
                                </Button>
                            </div>
                        )}
                    </>
                )}

                {status === OPERATION_STATUSES.PROCESSING && (
                    <div className="mt-6 flex flex-col items-center gap-4 py-10 animate-pulse">
                        <Spinner />
                        <p className="text-muted-foreground">
                            Removing background. This may take a moment...
                        </p>
                    </div>
                )}

                {status === OPERATION_STATUSES.SUCCESS && resultUrl && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                        <div>
                            <h3 className="font-bold text-lg text-center mb-2 text-foreground">Result</h3>
                            <div className="bg-grid-pattern p-2 rounded-xl border border-border aspect-square">
                                <canvas ref={canvasRef} className="w-full h-full rounded-lg" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-center mb-2 text-foreground">Customize Background</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="bg-color">Background Color</Label>
                                    <div className="relative">
                                        <Input id="bg-color" type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full pl-12" />
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-2">
                                            <Input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setBgImage(null); }} className="h-8 w-8 p-0 border-none rounded-lg cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center text-muted-foreground">OR</div>
                                <div>
                                    <Label>Background Image</Label>
                                    <Dropzone onDrop={handleBgImageDrop} accept={{ 'image/*': [] }} />
                                    {bgImage && <p className="text-sm text-center mt-2 text-muted-foreground">Selected: {bgImage.name}</p>}
                                </div>
                            </div>
                            <div className="mt-6 flex flex-col gap-2">
                                <Button onClick={handleDownload} className="w-full">
                                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" /> Download
                                </Button>
                                <Button onClick={handleReset} variant="ghost" className="w-full">Start Over</Button>
                            </div>
                        </div>
                    </div>
                )}

                {status === OPERATION_STATUSES.ERROR && (
                    <div className="mt-6 text-center bg-destructive/10 p-6 rounded-xl animate-fadeIn">
                        <XCircleIcon className="h-12 w-12 text-destructive mx-auto mb-4" />
                        <p className="text-destructive font-bold">An Error Occurred</p>
                        <p className="text-destructive/80 text-sm">{errorMessage}</p>
                        <Button onClick={handleReset} variant="ghost" className="mt-4">Try Again</Button>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default BackgroundRemoverPage;