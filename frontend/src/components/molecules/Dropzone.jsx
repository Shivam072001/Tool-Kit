// src/components/common/Dropzone.jsx

import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowUpTrayIcon } from '@heroicons/react/24/solid';

const Dropzone = ({ onDrop, accept, multiple = false }) => {
    const handleDrop = useCallback((acceptedFiles) => {
        onDrop(acceptedFiles);
    }, [onDrop]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleDrop,
        accept: typeof accept === 'object' ? accept : { [accept]: [] },
        multiple,
    });

    return (
        <div
            {...getRootProps()}
            className={`border-2 border-dashed border-border p-10 text-center cursor-pointer rounded-lg transition-colors
        ${isDragActive ? 'bg-primary/10 border-primary' : 'hover:bg-input'}
      `}
        >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center">
                <ArrowUpTrayIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                    {isDragActive ? "Drop the files here..." : "Drag 'n' drop files here, or click to select"}
                </p>
            </div>
        </div>
    );
};

export default Dropzone;