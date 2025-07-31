import React from 'react';
import Card from '../atoms/Card';

const ResourceListItem = ({ children, actions }) => {
    return (
        <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1 overflow-hidden">
                {children}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                {actions}
            </div>
        </Card>
    );
};

export default ResourceListItem;