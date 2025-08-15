// src/components/organisms/PasswordGenerator.jsx

import React, { useState } from 'react';
import Card from '../atoms/Card';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

const PasswordGenerator = () => {
    const [password, setPassword] = useState('');
    const [length, setLength] = useState(16);
    const [includeUppercase, setIncludeUppercase] = useState(true);
    const [includeNumbers, setIncludeNumbers] = useState(true);
    const [includeSymbols, setIncludeSymbols] = useState(true);
    const [copied, setCopied] = useState(false);

    const generatePassword = () => {
        const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
        const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numberChars = '0123456789';
        const symbolChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

        let allChars = lowerChars;
        if (includeUppercase) allChars += upperChars;
        if (includeNumbers) allChars += numberChars;
        if (includeSymbols) allChars += symbolChars;

        let generatedPassword = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allChars.length);
            generatedPassword += allChars[randomIndex];
        }
        setPassword(generatedPassword);
        setCopied(false);
    };

    const copyToClipboard = () => {
        if (password) {
            navigator.clipboard.writeText(password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        }
    };

    return (
        <Card className="p-6 sticky top-28">
            <h3 className="text-xl font-bold mb-4 text-primary-text">Generate a Password</h3>

            <div className="relative mb-4">
                <Input id="generated-password" type="text" value={password} readOnly placeholder="Click Generate..." />
                <button onClick={copyToClipboard} className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <ClipboardDocumentIcon className="h-5 w-5 text-muted-foreground hover:text-primary-text" />
                </button>
            </div>
            {copied && <p className="text-sm text-green-500 text-center mb-4">Copied to clipboard!</p>}

            <div className="mb-4">
                <Label htmlFor="length">Password Length: {length}</Label>
                <input
                    id="length"
                    type="range"
                    min="8"
                    max="64"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full h-2 bg-input rounded-lg appearance-none cursor-pointer"
                />
            </div>

            <div className="space-y-2 mb-6">
                <div className="flex items-center">
                    <input type="checkbox" id="uppercase" checked={includeUppercase} onChange={() => setIncludeUppercase(!includeUppercase)} className="h-4 w-4 rounded border-border text-primary focus:ring-ring" />
                    <Label htmlFor="uppercase" className="ml-2">Include Uppercase (A-Z)</Label>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" id="numbers" checked={includeNumbers} onChange={() => setIncludeNumbers(!includeNumbers)} className="h-4 w-4 rounded border-border text-primary focus:ring-ring" />
                    <Label htmlFor="numbers" className="ml-2">Include Numbers (0-9)</Label>
                </div>
                <div className="flex items-center">
                    <input type="checkbox" id="symbols" checked={includeSymbols} onChange={() => setIncludeSymbols(!includeSymbols)} className="h-4 w-4 rounded border-border text-primary focus:ring-ring" />
                    <Label htmlFor="symbols" className="ml-2">Include Symbols (!@#$...)</Label>
                </div>
            </div>

            <Button onClick={generatePassword} className="w-full">Generate</Button>
        </Card>
    );
};

export default PasswordGenerator;