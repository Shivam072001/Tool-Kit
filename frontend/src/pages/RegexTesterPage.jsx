// src/pages/RegexTesterPage.jsx

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Label from '../components/atoms/Label';
import Button from '../components/atoms/Button';
import ConfirmDeleteModal from '../components/organisms/ConfirmDeleteModal';
import RegexResultDisplay from '../components/organisms/RegexResultDisplay';
import { regexService } from '../services/regexService';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import RegexList from '../components/organisms/RegexList';

const RegexTesterPage = () => {
    const [pattern, setPattern] = useState('[a-zA-Z]+');
    const [flags, setFlags] = useState({ g: true, i: false, m: false });
    const [testString, setTestString] = useState('The quick brown Fox jumps over the lazy Dog.');
    const [error, setError] = useState('');
    const [flavor, setFlavor] = useState('javascript');
    const [apiResult, setApiResult] = useState(null);
    const [isLoadingApi, setIsLoadingApi] = useState(false);

    // State for persistence
    const [history, setHistory] = useState([]);
    const [patternName, setPatternName] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchHistory = useCallback(async () => {
        try {
            const response = await regexService.getHistory();
            setHistory(response.data.history);
        } catch (error) {
            console.error("Failed to fetch regex history", error);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const activeFlags = useMemo(() => {
        return Object.keys(flags).filter(f => flags[f]).join('');
    }, [flags]);

    // Effect to handle backend validation for non-JavaScript flavors
    useEffect(() => {
        const testOnBackend = async () => {
            if (!pattern) {
                setApiResult(null);
                setError('');
                return;
            }
            setIsLoadingApi(true);
            setError('');
            try {
                const response = await regexService.testPattern({
                    pattern,
                    testString,
                    flavor,
                    flags: activeFlags
                });
                if (response.data.error) {
                    setError(`Invalid Python Regex: ${response.data.error}`);
                    setApiResult(null);
                } else {
                    setError('');
                    setApiResult(response.data.matches);
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to test pattern on server.');
                setApiResult(null);
            } finally {
                setIsLoadingApi(false);
            }
        };

        if (flavor !== 'javascript') {
            const handler = setTimeout(() => {
                testOnBackend();
            }, 300); // Debounce API calls
            return () => clearTimeout(handler);
        } else {
            setApiResult(null); // Clear API result if switching back to JS
            setError('');
        }
    }, [pattern, testString, flavor, activeFlags]);

    const handleFlagChange = (flag) => {
        setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
    };

    // Memoized local regex for JavaScript flavor
    const localRegex = useMemo(() => {
        if (flavor !== 'javascript' || !pattern) {
            if (flavor === 'javascript') setError('');
            return null;
        }
        try {
            const re = new RegExp(pattern, activeFlags);
            setError('');
            return re;
        } catch (e) {
            setError('Invalid JavaScript Regular Expression');
            return null;
        }
    }, [pattern, activeFlags, flavor]);

    const handleSavePattern = async () => {
        if (!patternName.trim() || !pattern.trim()) return;
        try {
            await regexService.savePattern({
                name: patternName,
                pattern,
                flags: activeFlags,
            });
            setPatternName('');
            await fetchHistory();
        } catch (error) {
            console.error("Failed to save pattern", error);
        }
    };

    const loadFromHistory = (item) => {
        setPattern(item.pattern);
        const newFlags = { g: false, i: false, m: false };
        if (item.flags) {
            for (const char of item.flags) {
                if (Object.prototype.hasOwnProperty.call(newFlags, char)) {
                    newFlags[char] = true;
                }
            }
        }
        setFlags(newFlags);
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
            await regexService.deletePattern(itemToDelete.id);
            await fetchHistory();
        } catch (error) {
            console.error("Failed to delete pattern", error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-primary-text">Regex Tester</h1>
            <p className="text-muted-foreground mb-8">
                Test and save your regular expressions in real-time.
            </p>

            <Card className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-3">
                        <Label htmlFor="regex-pattern">Regular Expression</Label>
                        <Input id="regex-pattern" value={pattern} onChange={(e) => setPattern(e.target.value)} className="font-mono" />
                    </div>
                    <div>
                        <Label htmlFor="regex-flavor">Flavor</Label>
                        <select id="regex-flavor" value={flavor} onChange={(e) => setFlavor(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-md">
                            <option value="javascript">JavaScript</option>
                            <option value="python">Python (PCRE)</option>
                        </select>
                    </div>
                </div>
                <div className="mt-4">
                    <Label>Flags</Label>
                    <div className="flex flex-wrap gap-4 mt-1">
                        {Object.keys(flags).map(flag => (
                            <div key={flag} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`flag-${flag}`}
                                    checked={flags[flag]}
                                    onChange={() => handleFlagChange(flag)}
                                    className="h-4 w-4 rounded border-border text-primary focus:ring-ring"
                                />
                                <Label htmlFor={`flag-${flag}`} className="ml-2 font-mono">{flag}</Label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-4">
                    <Label htmlFor="test-string">Test String</Label>
                    <textarea
                        id="test-string"
                        value={testString}
                        onChange={(e) => setTestString(e.target.value)}
                        className="w-full h-40 p-2 mt-1 bg-input border border-border rounded-md font-mono"
                    />
                </div>
                {error && <p className="text-destructive mt-2 text-center">{error}</p>}

                <div className="mt-8 border-t border-border pt-6">
                    <Label htmlFor="pattern-name">Save Pattern</Label>
                    <div className="flex flex-col sm:flex-row gap-4 mt-1">
                        <Input
                            id="pattern-name"
                            type="text"
                            value={patternName}
                            onChange={(e) => setPatternName(e.target.value)}
                            placeholder="e.g., Email Validator"
                            className="flex-grow"
                        />
                        <Button
                            onClick={handleSavePattern}
                            disabled={!patternName.trim() || !pattern.trim() || !!error}
                            className="w-full sm:w-auto"
                        >
                            <BookmarkIcon className="h-5 w-5 mr-2" />
                            Save
                        </Button>
                    </div>
                </div>
            </Card>

            <h3 className="text-2xl font-bold my-4 text-primary-text">Result</h3>
            {isLoadingApi && <div className="flex justify-center"><p className="text-muted-foreground">Testing...</p></div>}
            <RegexResultDisplay
                testString={testString}
                regex={localRegex}
                apiResult={apiResult}
            />

            <RegexList history={history} onLoad={loadFromHistory} onDeleteClick={handleDeleteClick} />

            <ConfirmDeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} itemName={itemToDelete.name} isLoading={isDeleting} />
        </div>
    );
};

export default RegexTesterPage;
