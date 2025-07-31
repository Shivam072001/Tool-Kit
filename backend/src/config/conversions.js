// src/config/conversions.js

export const conversionMap = {
    // PDF conversions
    'application/pdf': ['DOCX', 'PNG', 'JPEG', 'TXT'],

    // Word conversions
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['PDF'],

    // Image conversions
    'image/jpeg': ['PDF', 'PNG', 'WEBP', 'GIF'],
    'image/png': ['PDF', 'JPEG', 'WEBP', 'GIF'],
    'image/webp': ['PDF', 'JPEG', 'PNG'],
    'image/gif': ['PNG', 'JPEG'],

    // Spreadsheet conversions
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['CSV'], // XLSX to CSV
    'text/csv': ['XLSX'], // CSV to XLSX

    // Presentation conversions
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['PDF'], // PPTX to PDF
    'application/vnd.ms-powerpoint': ['PDF'], // PPT to PDF
};

// We also export a flat list of all accepted MIME types for the upload middleware
export const allowedMimeTypes = Object.keys(conversionMap);