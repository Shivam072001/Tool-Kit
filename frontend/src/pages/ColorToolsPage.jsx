// src/pages/ColorToolsPage.jsx
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import Label from '../components/atoms/Label';
import Button from '../components/atoms/Button';
import ColorInput from '../components/molecules/ColorInput';
import PaletteList from '../components/organisms/PaletteList';
import ConfirmDeleteModal from '../components/organisms/ConfirmDeleteModal';
import { colorService } from '../services/colorService';
import { CheckCircleIcon, XCircleIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import { checkWcagCompliance, getContrastRatio, ColorBlindnessFilters } from '../utils/colors';


const ColorToolsPage = () => {
    // Contrast Checker State
    const [colorA, setColorA] = useState('#ffffff');
    const [colorB, setColorB] = useState('#000000');

    // Palette State
    const [palette, setPalette] = useState(['#FFFFFF', '#000000', '#3B82F6', '#EC4899', '#10B981']);
    const [paletteName, setPaletteName] = useState('');
    const [savedPalettes, setSavedPalettes] = useState([]);

    // New state for Color Blindness Simulator
    const [simulationType, setSimulationType] = useState('none');

    // Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState({ id: null, name: '' });
    const [isDeleting, setIsDeleting] = useState(false);

    // Fetch saved palettes on component mount
    const fetchPalettes = useCallback(async () => {
        try {
            const response = await colorService.getPalettes();
            setSavedPalettes(response.data.palettes);
        } catch (error) {
            console.error('Failed to fetch palettes:', error);
        }
    }, []);

    useEffect(() => {
        fetchPalettes();
    }, [fetchPalettes]);

    const contrastResult = useMemo(() => {
        const ratio = getContrastRatio(colorA, colorB);
        const compliance = checkWcagCompliance(ratio);
        return { ratio, compliance };
    }, [colorA, colorB]);

    const handleColorChange = (index, newColor) => {
        const newPalette = [...palette];
        newPalette[index] = newColor;
        setPalette(newPalette);
    };
    const addColorToPalette = () => setPalette([...palette, '#10B981']);
    const removeColorFromPalette = (index) => setPalette(palette.filter((_, i) => i !== index));

    const handleSavePalette = async () => {
        if (!paletteName.trim() || palette.length === 0) return;
        try {
            await colorService.savePalette({ name: paletteName, colors: palette });
            setPaletteName('');
            await fetchPalettes();
        } catch (error) {
            console.error('Failed to save palette:', error);
        }
    };
    const handleDeleteClick = (id, name) => {
        setItemToDelete({ id, name });
        setShowDeleteModal(true);
    };
    const handleConfirmDelete = async () => {
        if (!itemToDelete.id) return;
        setIsDeleting(true);
        try {
            await colorService.deletePalette(itemToDelete.id);
            await fetchPalettes();
        } catch (error) {
            console.error('Failed to delete palette:', error);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    const loadPalette = (colors) => {
        setPalette(colors);
        if (colors.length >= 2) {
            setColorA(colors[0]);
            setColorB(colors[1]);
        }
        window.scrollTo(0, 0);
    };

    return (
        <>
            <ColorBlindnessFilters />
            <div className="max-w-4xl mx-auto animate-fadeIn">
                <h1 className="text-4xl font-bold mb-2 text-foreground">Color Utilities Suite</h1>
                <p className="text-muted-foreground mb-8">
                    Check contrast, build palettes, and simulate color blindness.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-8 animate-slideInLeft">
                        <Card className="p-8">
                            <h2 className="text-2xl font-bold mb-4 text-foreground">WCAG Contrast Checker</h2>
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <ColorInput label="Text Color" id="colorA" value={colorA} onChange={(e) => setColorA(e.target.value)} />
                                    <ColorInput label="Background" id="colorB" value={colorB} onChange={(e) => setColorB(e.target.value)} />
                                </div>
                                <div className="p-6 rounded-xl text-center transition-colors duration-300" style={{ backgroundColor: colorB, color: colorA }}>
                                    <p className="font-bold text-2xl">Ratio: {contrastResult.ratio.toFixed(2)}</p>
                                    <div className="flex justify-center gap-6 mt-4">
                                        <span className="flex items-center gap-2">
                                            {contrastResult.compliance.aa ? <CheckCircleIcon className="h-6 w-6 text-green-400" /> : <XCircleIcon className="h-6 w-6 text-red-400" />} AA
                                        </span>
                                        <span className="flex items-center gap-2">
                                            {contrastResult.compliance.aaa ? <CheckCircleIcon className="h-6 w-6 text-green-400" /> : <XCircleIcon className="h-6 w-6 text-red-400" />} AAA
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8">
                            <h2 className="text-2xl font-bold mb-4 text-foreground">Color Blindness Simulator</h2>
                            <div>
                                <Label htmlFor="simulation-type">Simulation Type</Label>
                                <select
                                    id="simulation-type"
                                    value={simulationType}
                                    onChange={e => setSimulationType(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-input border border-border rounded-lg shadow-sm"
                                >
                                    <option value="none">None (Normal Vision)</option>
                                    <option value="protanopia">Protanopia (Red-Blind)</option>
                                    <option value="deuteranopia">Deuteranopia (Green-Blind)</option>
                                    <option value="tritanopia">Tritanopia (Blue-Blind)</option>
                                    <option value="achromatopsia">Achromatopsia (Monochrome)</option>
                                </select>
                            </div>
                            <div
                                className="mt-4 p-4 border-2 border-dashed border-border rounded-xl transition-all duration-300"
                                style={{ filter: simulationType !== 'none' ? `url(#${simulationType})` : 'none' }}
                            >
                                <div className="flex flex-wrap gap-2 justify-center">
                                    {palette.map((color, index) => (
                                        <div key={index} className="h-16 w-16 rounded-xl border-2 border-border transition-all duration-300" style={{ backgroundColor: color }} />
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="animate-slideInRight">
                        <Card className="p-8 sticky top-28">
                            <h2 className="text-2xl font-bold mb-4 text-foreground">Palette Builder</h2>
                            <div className="space-y-4">
                                {palette.map((color, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <ColorInput label={`Color ${index + 1}`} id={`palette-color-${index}`} value={color} onChange={(e) => handleColorChange(index, e.target.value)} />
                                        <Button onClick={() => removeColorFromPalette(index)} variant="destructive" className="mt-6 !p-2">
                                            <TrashIcon className="h-5 w-5" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={addColorToPalette} variant="secondary" className="mt-6">
                                <PlusIcon className="h-5 w-5 mr-2" />
                                Add Color
                            </Button>
                            <div className="mt-8 border-t border-border pt-6">
                                <Label htmlFor="palette-name">Save Current Palette</Label>
                                <div className="flex flex-col sm:flex-row gap-4 mt-1">
                                    <Input id="palette-name" type="text" value={paletteName} onChange={(e) => setPaletteName(e.target.value)} placeholder="e.g., Brand Colors" />
                                    <Button onClick={handleSavePalette} disabled={!paletteName.trim()}>Save</Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <PaletteList palettes={savedPalettes} onDeleteClick={handleDeleteClick} onPaletteClick={loadPalette} />

                <ConfirmDeleteModal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)} onConfirm={handleConfirmDelete} itemName={itemToDelete.name} isLoading={isDeleting} />
            </div>
        </>
    );
};

export default ColorToolsPage;
