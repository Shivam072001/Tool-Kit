// src/components/common/ThemeSwitcher.jsx

import React from 'react';
import { useTheme, themeList } from '../../hooks/useTheme';
import { SunIcon, MoonIcon, PaintBrushIcon } from '@heroicons/react/24/solid';

const ThemeSwitcher = () => {
    const { theme, setTheme, mode, toggleMode } = useTheme();

    return (
        <div className="flex items-center gap-2">
            <div className="relative group">
                <button className="p-2 rounded-full hover:bg-border transition-colors">
                    <PaintBrushIcon className="h-6 w-6 text-foreground" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto z-50">
                    <div className="py-2">
                        {themeList.map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setTheme(t.id)}
                                className={`w-full text-left px-4 py-2 text-sm transition-colors ${theme === t.id ? 'bg-primary text-primary-foreground' : 'text-card-foreground hover:bg-input'
                                    }`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button onClick={toggleMode} className="p-2 rounded-full hover:bg-border transition-colors">
                {mode === 'light' ? (
                    <MoonIcon className="h-6 w-6 text-foreground" />
                ) : (
                    <SunIcon className="h-6 w-6 text-yellow-400" />
                )}
            </button>
        </div>
    );
};

export default ThemeSwitcher;
