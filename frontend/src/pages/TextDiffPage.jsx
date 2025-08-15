// src/pages/TextDiffPage.jsx

import React, { useCallback, useEffect, useState } from 'react';
import * as Diff from 'diff';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Label from '../components/atoms/Label';
import DiffResultDisplay from '../components/organisms/DiffResultDisplay.jsx';
import { textDiffService } from '../services/textDiffService.js';
import TextDiffList from '../components/organisms/TextDiffList.jsx';
import ConfirmDeleteModal from '../components/organisms/ConfirmDeleteModal.jsx';

const TextDiffPage = () => {
    const [textA, setTextA] = useState('');
    const [textB, setTextB] = useState('');
    const [diffResult, setDiffResult] = useState(null);
    const [history, setHistory] = useState([]);
    const [language, setLanguage] = useState('plaintext'); // New state for syntax highlighting

    // --- Delete Modal State ---
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchHistory = useCallback(async () => {
        try {
            const response = await textDiffService.getHistory();
            setHistory(response.data.history);
        } catch (error) {
            console.error("Failed to fetch diff history", error);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Re-run comparison when language changes
    useEffect(() => {
        if (textA || textB) {
            handleCompare(false); // Pass false to prevent saving again
        }
    }, [language, textA, textB]);


    const handleCompare = async (shouldSave = true) => {
        const differences = Diff.diffWords(textA, textB);
        setDiffResult(differences);

        if (shouldSave && (textA || textB)) {
            try {
                await textDiffService.saveDiff(textA, textB);
                await fetchHistory();
            } catch (error) {
                console.error("Failed to save diff", error);
            }
        }
    };

    const handleClear = () => {
        setTextA('');
        setTextB('');
        setDiffResult(null);
    };

    const loadFromHistory = (original, changed) => {
        setTextA(original);
        setTextB(changed);
        setDiffResult(Diff.diffWords(original, changed));
        window.scrollTo(0, 0);
    };

    const handleDeleteClick = (id, name) => {
        setItemToDelete({ id, name });
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete.id) return;
        setIsDeleting(true);
        try {
            await textDiffService.deleteDiff(itemToDelete.id);
            await fetchHistory();
        } catch (error) {
            console.error("Failed to delete diff record", error);
        } finally {
            setShowDeleteModal(false);
            setItemToDelete({ id: null, name: '' });
            setIsDeleting(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-fadeIn">
            <h1 className="text-4xl font-bold mb-2 text-primary-text">Text Difference Checker</h1>
            <p className="text-muted-foreground mb-8">Compare two pieces of text to see what's changed. Your comparisons are saved automatically.</p>

            <Card className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <textarea
                        value={textA}
                        onChange={(e) => setTextA(e.target.value)}
                        placeholder="Paste the original text here..."
                        className="w-full h-80 p-4 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-primary resize-none font-mono text-sm transition-colors"
                    />
                    <textarea
                        value={textB}
                        onChange={(e) => setTextB(e.target.value)}
                        placeholder="Paste the changed text here..."
                        className="w-full h-80 p-4 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-primary resize-none font-mono text-sm transition-colors"
                    />
                </div>
                <div className="mt-6 flex flex-wrap items-end gap-4">
                    <Button onClick={() => handleCompare(true)} disabled={!textA && !textB}>
                        Compare & Save
                    </Button>
                    <Button onClick={handleClear} variant="ghost">
                        Clear
                    </Button>
                    <div className="ml-auto">
                        <Label htmlFor="language-select">Syntax Highlighting</Label>
                        <select
                            id="language-select"
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mt-1 block w-full sm:w-48 px-3 py-2 bg-input border border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="plaintext">Plain Text</option>
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python</option>
                            <option value="css">CSS</option>
                            <option value="html">HTML</option>
                            <option value="json">JSON</option>
                            <option value="markdown">Markdown</option>
                        </select>
                    </div>
                </div>
            </Card>

            <DiffResultDisplay diffResult={diffResult} language={language} />

            <TextDiffList history={history} onLoad={loadFromHistory} onDeleteClick={handleDeleteClick} />

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

export default TextDiffPage;
