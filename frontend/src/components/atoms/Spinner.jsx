import React from 'react';

const Spinner = ({ className = 'h-8 w-8' }) => {
    return (
        <div
            className={`${className} animate-spin rounded-full border-4 border-border border-t-primary`}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    );
};

export default Spinner;