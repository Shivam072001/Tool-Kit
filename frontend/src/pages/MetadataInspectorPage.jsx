// src/pages/MetadataInspectorPage.jsx

import React, { useState, useCallback, useEffect } from "react";
import Card from "../components/atoms/Card";
import Button from "../components/atoms/Button";
import Dropzone from "../components/molecules/Dropzone";
import Spinner from "../components/atoms/Spinner";
import MetadataDisplay from "../components/organisms/MetadataDisplay";
import MetadataList from "../components/organisms/MetadataList";
import ConfirmDeleteModal from "../components/organisms/ConfirmDeleteModal";
import { metadataService } from "../services/metadataService";
import { OPERATION_STATUSES } from "../constants";

const MetadataInspectorPage = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("idle");
    const [metadata, setMetadata] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [history, setHistory] = useState([]);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ id: null, name: "" });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchHistory = useCallback(async () => {
        try {
            const response = await metadataService.getHistory();
            setHistory(response.data.history);
        } catch (error) {
            console.error("Could not fetch inspection history");
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setStatus("idle");
            setMetadata(null);
            setErrorMessage("");
        }
    }, []);

    const handleInspect = async () => {
        if (!file) return;
        setStatus("inspecting");
        try {
            const response = await metadataService.inspectFile(file);
            setMetadata(response.data.metadata);
            setStatus(OPERATION_STATUSES.SUCCESS);
            await fetchHistory();
        } catch (err) {
            setErrorMessage(err.response?.data?.message || "Failed to inspect file.");
            setStatus(OPERATION_STATUSES.ERROR);
        }
    };

    const handleDeleteClick = (id, name) => {
        setItemToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete.id) return;
        setIsDeleting(true);
        try {
            await metadataService.deleteHistory(itemToDelete.id);
            await fetchHistory();
        } catch (error) {
            console.error("Failed to delete history item", error);
        } finally {
            setShowDeleteModal(false);
            setItemToDelete({ id: null, name: "" });
            setIsDeleting(false);
        }
    };

    const handleReset = () => {
        setFile(null);
        setStatus("idle");
        setMetadata(null);
        setErrorMessage("");
    };

    return (
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-4xl font-bold mb-2 text-primary-text">
                Metadata Inspector
            </h1>
            <p className="text-muted-foreground mb-8">
                Upload a file to view its hidden properties and data.
            </p>

            <Card className="p-8">
                <Dropzone onDrop={handleDrop} />
                {file && (
                    <div className="mt-6 text-center animate-fadeIn">
                        <p className="text-primary-text">
                            Selected: <span className="font-medium">{file.name}</span>
                        </p>
                        <Button
                            onClick={handleInspect}
                            isLoading={status === "inspecting"}
                            className="mt-4"
                        >
                            Inspect File
                        </Button>
                    </div>
                )}
            </Card>

            {status === "inspecting" && (
                <div className="flex justify-center mt-8 animate-fadeIn">
                    <Spinner />
                </div>
            )}
            {status === OPERATION_STATUSES.ERROR && (
                <Card className="mt-8 p-4 bg-destructive/10 text-center text-destructive font-bold animate-fadeIn">
                    {errorMessage}
                </Card>
            )}

            {status === OPERATION_STATUSES.SUCCESS && <MetadataDisplay metadata={metadata} />}

            {(status === OPERATION_STATUSES.SUCCESS || status === OPERATION_STATUSES.ERROR) && (
                <div className="text-center mt-6">
                    <Button onClick={handleReset} variant="ghost">
                        Inspect Another File
                    </Button>
                </div>
            )}

            <MetadataList
                history={history}
                onDeleteClick={handleDeleteClick}
            />

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

export default MetadataInspectorPage;
