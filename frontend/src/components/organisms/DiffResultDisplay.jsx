// src/components/organisms/DiffResultViewer.jsx

import React, { useEffect } from 'react';
import Card from '../atoms/Card';
import hljs from 'highlight.js';
// In a real project, you would import the CSS for your chosen theme, e.g.:
// import 'highlight.js/styles/github-dark.css';

const DiffResultDisplay = ({ diffResult, language }) => {

    useEffect(() => {
        // This effect will re-run highlighting whenever the diff result changes.
        // It's not strictly necessary if we highlight during render, but good for complex cases.
        hljs.configure({ ignoreUnescapedHTML: true });
        document.querySelectorAll('pre code.diff-code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }, [diffResult, language]);


    if (!diffResult) {
        return null;
    }

    const renderPart = (part) => {
        const highlighted = hljs.highlight(part.value, { language, ignoreIllegals: true }).value;
        return <code className={`language-${language} diff-code`} dangerouslySetInnerHTML={{ __html: highlighted }} />;
    };

    return (
        <Card className="mt-8 p-0">
            <h3 className="text-xl font-bold text-primary-text p-6 border-b border-border">
                Comparison Result
            </h3>
            <pre className="p-6 whitespace-pre-wrap break-words text-sm font-mono bg-input">
                {diffResult.map((part, index) => {
                    const style = {
                        backgroundColor: part.added ? 'rgba(46, 160, 67, 0.2)' : part.removed ? 'rgba(248, 81, 73, 0.2)' : 'transparent',
                        textDecoration: part.removed ? 'line-through' : 'none',
                        display: 'inline',
                    };

                    return (
                        <span key={index} style={style}>
                            {renderPart(part)}
                        </span>
                    );
                })}
            </pre>
        </Card>
    );
};

export default DiffResultDisplay;