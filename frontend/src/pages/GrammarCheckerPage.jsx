// frontend/src/pages/GrammarCheckerPage.jsx

import React, { useState, useEffect } from 'react';
import { textService } from '../services/textService';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import { OPERATION_STATUSES } from '../constants';
import { ClipboardDocumentIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import { useTaskPoller } from '../hooks/useTaskPoller';

const GrammarCheckerPage = () => {
    const [text, setText] = useState('');
    const [taskId, setTaskId] = useState(null);
    const [matches, setMatches] = useState([]);
    const [copied, setCopied] = useState(false);
    const { status, result, errorMessage, setStatus } = useTaskPoller(taskId, textService.checkJobStatus);

    useEffect(() => {
        if (status === OPERATION_STATUSES.SUCCESS && result) {
            setMatches(Array.isArray(result) ? result : JSON.parse(result));
        }
    }, [status, result]);


    const handleCheckGrammar = async () => {
        if (!text.trim()) return;
        setStatus(OPERATION_STATUSES.PROCESSING);
        try {
            const data = await textService.submitForGrammarCheck(text);
            setTaskId(data.taskId);
        } catch (err) {
            setStatus(OPERATION_STATUSES.ERROR);
        }
    };

    const applySuggestion = (match, replacement) => {
        const newText = text.substring(0, match.offset) + replacement + text.substring(match.offset + match.length);
        setText(newText);
        setMatches(matches.filter(m => m !== match));
    };

    const copyToClipboard = () => {
        if (text) {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const renderTextWithHighlights = () => {
        if (status !== OPERATION_STATUSES.SUCCESS || matches.length === 0) {
            return <span className="text-muted-foreground">{text}</span>;
        }

        let lastIndex = 0;
        const parts = [];
        matches.forEach((match, index) => {
            if (match.offset > lastIndex) {
                parts.push(text.substring(lastIndex, match.offset));
            }
            parts.push(
                <span key={index} className="bg-primary/30 rounded px-1 relative group cursor-pointer">
                    {text.substring(match.offset, match.offset + match.length)}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-card border border-border rounded-xl shadow-lg p-3 text-sm text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-10">
                        <p className="font-bold text-destructive flex items-center gap-2 mb-2"><LightBulbIcon className="h-5 w-5" />{match.message}</p>
                        {match.replacements.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-border">
                                {match.replacements.slice(0, 3).map((rep, i) => (
                                    <button
                                        key={i}
                                        onClick={() => applySuggestion(match, rep)}
                                        className="block w-full text-left px-2 py-1 rounded-md text-primary hover:bg-input transition-colors"
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
        <div className="max-w-4xl mx-auto animate-fadeIn">
            <h1 className="text-4xl font-bold mb-2 text-foreground">AI Grammar Checker</h1>
            <p className="text-muted-foreground mb-8">Improve your writing with advanced grammar and style suggestions.</p>

            <Card className="p-1">
                <div className="relative">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Paste your text here..."
                        className="w-full h-96 p-4 bg-transparent border-0 rounded-xl focus:ring-0 resize-none font-mono text-lg leading-relaxed absolute top-0 left-0 z-10"
                        style={{ color: 'transparent', caretColor: 'var(--colors-foreground)' }}
                    />
                    <div
                        className="p-4 whitespace-pre-wrap font-mono text-lg leading-relaxed pointer-events-none rounded-xl"
                    >
                        {text.length === 0 ? <span className="text-muted-foreground">Paste your text here...</span> : renderTextWithHighlights()}
                    </div>
                </div>
            </Card>
            <div className="mt-6 flex gap-4 items-center">
                <Button onClick={handleCheckGrammar} isLoading={status === OPERATION_STATUSES.PROCESSING} disabled={!text.trim()}>
                    Check Grammar
                </Button>
                <Button onClick={() => { setText(''); setStatus('idle'); setTaskId(null); }} variant="ghost">Clear</Button>
                <Button onClick={copyToClipboard} variant="ghost" className="ml-auto">
                    <ClipboardDocumentIcon className="h-5 w-5 mr-2" /> {copied ? 'Copied!' : 'Copy Text'}
                </Button>
            </div>
            {status === OPERATION_STATUSES.ERROR && <p className="text-destructive mt-4 text-center">{errorMessage}</p>}

        </div>
    );
};

export default GrammarCheckerPage;