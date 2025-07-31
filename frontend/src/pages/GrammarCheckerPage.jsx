// frontend/src/pages/GrammarCheckerPage.jsx

import React, { useState, useEffect } from 'react';
import { textService } from '../services/textService';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import Spinner from '../components/atoms/Spinner';
import { OPERATION_STATUSES, POLLING_INTERVAL_MS } from '../constants';

const POLLING_INTERVAL = POLLING_INTERVAL_MS;

const GrammarCheckerPage = () => {
    const [text, setText] = useState('');
    const [status, setStatus] = useState('idle');
    const [taskId, setTaskId] = useState(null);
    const [matches, setMatches] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    const resetState = () => {
        setStatus('idle');
        setTaskId(null);
        setMatches([]);
        setErrorMessage('');
    };

    useEffect(() => {
        let interval;
        if (status === OPERATION_STATUSES.PROCESSING && taskId) {
            interval = setInterval(async () => {
                try {
                    const data = await textService.checkJobStatus(taskId);
                    if (data.status === OPERATION_STATUSES.COMPLETED) {
                        setStatus(OPERATION_STATUSES.SUCCESS);
                        setMatches(Array.isArray(data.result) ? data.result : JSON.parse(data.resultText));
                        clearInterval(interval);
                    } else if (data.status === OPERATION_STATUSES.FAILED) {
                        setStatus(OPERATION_STATUSES.ERROR);
                        setErrorMessage(data.errorMessage || 'Grammar check failed.');
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

    const handleCheckGrammar = async () => {
        if (!text.trim()) return;
        setStatus(OPERATION_STATUSES.PROCESSING);
        try {
            const data = await textService.submitForGrammarCheck(text);
            setTaskId(data.taskId);
        } catch (err) {
            setStatus(OPERATION_STATUSES.ERROR);
            setErrorMessage(err.response?.data?.message || 'Submission failed.');
        }
    };

    const applySuggestion = (match, replacement) => {
        const newText = text.substring(0, match.offset) + replacement + text.substring(match.offset + match.length);
        setText(newText);
        setMatches(matches.filter(m => m !== match));
    };

    const renderTextWithHighlights = () => {
        if (status !== OPERATION_STATUSES.SUCCESS || matches.length === 0) {
            return text;
        }

        let lastIndex = 0;
        const parts = [];
        matches.forEach((match, index) => {
            if (match.offset > lastIndex) {
                parts.push(text.substring(lastIndex, match.offset));
            }
            parts.push(
                <span key={index} className="bg-yellow-300/30 rounded px-1 relative group cursor-pointer">
                    {text.substring(match.offset, match.offset + match.length)}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-card border border-border rounded-lg shadow-lg p-2 text-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto z-10">
                        <p className="font-bold text-destructive">{match.message}</p>
                        {match.replacements.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-border">
                                {match.replacements.slice(0, 3).map((rep, i) => (
                                    <button
                                        key={i}
                                        onClick={() => applySuggestion(match, rep)}
                                        className="block w-full text-left px-2 py-1 rounded hover:bg-input"
                                    >
                                        {rep}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </span>
            );
            lastIndex = match.offset + match.length;
        });

        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        return parts;
    };


    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2 text-foreground">AI Grammar Checker</h1>
            <p className="text-muted-foreground mb-8">Improve your writing with advanced grammar and style suggestions.</p>

            <Card className="p-1">
                <div className="relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your text here..."
                        className="w-full h-96 p-4 bg-transparent border-0 rounded-md focus:ring-0 resize-none font-mono text-lg leading-relaxed"
                        style={{ color: 'transparent', caretColor: 'var(--color-foreground)' }}
                    />
                    <div
                        className="absolute top-0 left-0 w-full h-full p-4 whitespace-pre-wrap font-mono text-lg leading-relaxed pointer-events-none"
                    >
                        {renderTextWithHighlights()}
                    </div>
                </div>
            </Card>
            <div className="mt-4 flex gap-4">
                <Button onClick={handleCheckGrammar} disabled={status === OPERATION_STATUSES.PROCESSING || !text.trim()}>
                    {status === OPERATION_STATUSES.PROCESSING ? <Spinner /> : 'Check Grammar'}
                </Button>
                <Button onClick={() => { setText(''); resetState(); }} variant="ghost">Clear</Button>
            </div>
            {status === OPERATION_STATUSES.ERROR && <p className="text-destructive mt-4">{errorMessage}</p>}

        </div>
    );
};

export default GrammarCheckerPage;