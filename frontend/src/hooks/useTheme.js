import React, { createContext, useContext, useEffect, useState } from 'react';

const defaultTheme = 'black-white';
const defaultMode = 'dark';

const ThemeContext = createContext();

export const themeList = [
    { name: 'Black & White', id: 'black-white' },
    { name: 'Pink & Teal', id: 'pink-teal-cream' },
    { name: 'Orange & Yellow', id: 'orange-yellow' },
    { name: 'Blue & Mint', id: 'blue-mint' },
];

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || defaultTheme);
    const [mode, setMode] = useState(() => localStorage.getItem('mode') || defaultMode);

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove('light', 'dark');
        themeList.forEach(t => root.removeAttribute(`data-theme-${t.id}`));

        root.classList.add(mode);
        root.setAttribute('data-theme', theme);

        localStorage.setItem('theme', theme);
        localStorage.setItem('mode', mode);
    }, [theme, mode]);

    const toggleMode = () => {
        setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const value = { theme, setTheme, mode, toggleMode };

    return React.createElement(ThemeContext.Provider, { value }, children);
};

export const useTheme = () => useContext(ThemeContext);
