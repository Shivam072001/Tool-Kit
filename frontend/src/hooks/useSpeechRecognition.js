// src/hooks/useSpeechRecognition.js

import { useState, useEffect, useRef } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechRecognition = () => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!SpeechRecognition) {
            setError('Speech recognition is not supported in your browser.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event) => {
            let finalTranscript = '';
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            // Update with the final part and the ongoing interim part
            setTranscript(prev => prev + finalTranscript + interimTranscript);
        };

        recognition.onerror = (event) => {
            setError(`Speech recognition error: ${event.error}`);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            setTranscript(''); // Clear previous transcript
            recognitionRef.current.start();
            setIsListening(true);
            setError('');
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    return { isListening, transcript, error, startListening, stopListening, hasSupport: !!SpeechRecognition };
};