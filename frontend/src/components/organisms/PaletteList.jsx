// src/components/organisms/PaletteList.jsx
import React from "react";
import ResourceListItem from "../molecules/ResourceListItem";
import { TrashIcon } from "@heroicons/react/24/outline";

const PaletteList = ({ palettes, onDeleteClick, onPaletteClick }) => {
    if (!palettes || palettes.length === 0) {
        return null;
    }
    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4 text-foreground">
                Saved Palettes
            </h2>
            <div className="space-y-4">
                {palettes.map((palette) => (
                    <ResourceListItem
                        key={palette._id}
                        actions={
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent onPaletteClick from firing
                                    onDeleteClick(palette._id, "Palette");
                                }}
                                className="p-2 text-muted-foreground hover:text-destructive rounded-full"
                                title="Delete Palette"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        }
                    >
                        <button
                            onClick={() => onPaletteClick(palette.colors)}
                            className="w-full text-left"
                        >
                            <p className="font-bold text-foreground">{palette.name}</p>
                            <div className="flex gap-2 mt-2">
                                {palette.colors.map((color, index) => (
                                    <div
                                        key={index}
                                        className="h-6 w-6 rounded-full border-2 border-border"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </button>
                    </ResourceListItem>
                ))}
            </div>
        </div>
    );
};
export default PaletteList;
