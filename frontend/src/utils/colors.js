import React from "react";

/**
 * Converts a HEX color string to an RGB object.
 * @param {string} hex - The hex color string (e.g., "#RRGGBB").
 * @returns {{r: number, g: number, b: number}}
 */
export const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16),
        }
        : null;
};

/**
 * Calculates the luminance of a color.
 * @param {{r: number, g: number, b: number}} rgb - The RGB color object.
 * @returns {number} The luminance value.
 */
const getLuminance = (rgb) => {
    const a = [rgb.r, rgb.g, rgb.b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

/**
 * Calculates the contrast ratio between two HEX colors.
 * @param {string} color1 - The first hex color.
 * @param {string} color2 - The second hex color.
 * @returns {number} The contrast ratio.
 */
export const getContrastRatio = (color1, color2) => {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    if (!rgb1 || !rgb2) return 1;

    const lum1 = getLuminance(rgb1);
    const lum2 = getLuminance(rgb2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
};

/**
 * Checks WCAG AA and AAA compliance for a given contrast ratio.
 * @param {number} ratio - The contrast ratio.
 * @returns {{aa: boolean, aaa: boolean}} Compliance results.
 */
export const checkWcagCompliance = (ratio) => {
    return {
        aa: ratio >= 4.5,
        aaa: ratio >= 7,
    };
};

export const ColorBlindnessFilters = () => (
    React.createElement('svg', { width: '0', height: '0', style: { position: 'absolute' } },
        React.createElement('defs', null,
            // Protanopia
            React.createElement('filter', { id: 'protanopia' },
                React.createElement('feColorMatrix', {
                    in: 'SourceGraphic',
                    type: 'matrix',
                    values:
                        '0.567, 0.433, 0,     0, 0 ' +
                        '0.558, 0.442, 0,     0, 0 ' +
                        '0,     0.242, 0.758, 0, 0 ' +
                        '0,     0,     0,     1, 0'
                })
            ),
            // Deuteranopia
            React.createElement('filter', { id: 'deuteranopia' },
                React.createElement('feColorMatrix', {
                    in: 'SourceGraphic',
                    type: 'matrix',
                    values:
                        '0.625, 0.375, 0,   0, 0 ' +
                        '0.7,   0.3,   0,   0, 0 ' +
                        '0,     0.3,   0.7, 0, 0 ' +
                        '0,     0,     0,   1, 0'
                })
            ),
            // Tritanopia
            React.createElement('filter', { id: 'tritanopia' },
                React.createElement('feColorMatrix', {
                    in: 'SourceGraphic',
                    type: 'matrix',
                    values:
                        '0.95, 0.05,  0,     0, 0 ' +
                        '0,    0.433, 0.567, 0, 0 ' +
                        '0,    0.475, 0.525, 0, 0 ' +
                        '0,    0,     0,     1, 0'
                })
            ),
            // Achromatopsia
            React.createElement('filter', { id: 'achromatopsia' },
                React.createElement('feColorMatrix', {
                    in: 'SourceGraphic',
                    type: 'matrix',
                    values:
                        '0.299, 0.587, 0.114, 0, 0 ' +
                        '0.299, 0.587, 0.114, 0, 0 ' +
                        '0.299, 0.587, 0.114, 0, 0 ' +
                        '0,     0,     0,     1, 0'
                })
            )
        )
    )
);