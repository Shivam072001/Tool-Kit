// src/components/organisms/RegexResultDisplay.jsx

import React from 'react';
import Card from '../atoms/Card';

const RegexResultDisplay = ({ testString, regex, apiResult }) => {

    const highlightMatches = (matches) => {
        const parts = [];
        let lastIndex = 0;
        matches.forEach((match, i) => {
            // Add text before the match
            if (match.start > lastIndex) {
                parts.push(testString.substring(lastIndex, match.start));
            }
            // Add the highlighted match
            parts.push(
                <span key={i} className="bg-primary/30 text-primary-foreground rounded px-1">
                    {match.text}
                </span>
            );
            lastIndex = match.end;
        });
        // Add any remaining text
        if (lastIndex < testString.length) {
            parts.push(testString.substring(lastIndex));
        }
        return parts;
    };

    if (apiResult) {
        // --- Render based on API result ---
        if (apiResult.length === 0) {
            return (
                <div className="p-6 bg-input rounded-md font-mono whitespace-pre-wrap">
                    {testString || 'Enter text above to see results.'}
                </div>
            );
        }
        return (
            <Card className="p-6 bg-input rounded-md font-mono whitespace-pre-wrap text-left">
                {highlightMatches(apiResult)}
            </Card>
        );
    }

    if (!regex || !testString) {
        // --- Default display or JS-based logic ---
        return (
            <div className="p-6 bg-input rounded-md font-mono whitespace-pre-wrap">
                {testString || 'Enter text above to see results.'}
            </div>
        );
    }

    // The original JavaScript-based matching logic
    const localMatches = [];
    let match;
    // Important: Create a new RegExp object to reset the lastIndex property for global searches
    const localRegex = new RegExp(regex);
    while ((match = localRegex.exec(testString)) !== null) {
        localMatches.push({ start: match.index, end: localRegex.lastIndex, text: match[0] });
        if (!localRegex.global) break;
        if (match[0].length === 0) localRegex.lastIndex++;
    }

    return (
        <Card className="p-6 bg-input rounded-md font-mono whitespace-pre-wrap text-left">
            {localMatches.length > 0 ? highlightMatches(localMatches) : testString}
        </Card>
    );
};

export default RegexResultDisplay;