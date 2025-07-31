// src/components/organisms/Inbox.jsx
import React, { useState } from 'react';

const Inbox = ({ emails }) => {
    const [selectedEmail, setSelectedEmail] = useState(null);

    if (!emails || emails.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">Your inbox is empty. Waiting for emails...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="md:col-span-1 border-r border-border pr-4">
                <h3 className="text-lg font-bold text-foreground mb-4">Inbox</h3>
                <ul className="space-y-2">
                    {emails.map((email) => (
                        <li key={email._id}>
                            <button
                                onClick={() => setSelectedEmail(email)}
                                className={`w-full text-left p-3 rounded-md transition-colors ${selectedEmail?._id === email._id
                                    ? 'bg-primary/20'
                                    : 'hover:bg-input'
                                    }`}
                            >
                                <p className="font-semibold text-foreground truncate">{email.from}</p>
                                <p className="text-sm text-muted-foreground truncate">{email.subject}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="md:col-span-2">
                {selectedEmail ? (
                    <div>
                        <h3 className="text-xl font-bold text-foreground">{selectedEmail.subject}</h3>
                        <p className="text-sm text-muted-foreground mt-1">From: {selectedEmail.from}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Received: {new Date(selectedEmail.receivedAt).toLocaleString()}
                        </p>
                        <div className="mt-6 border-t border-border pt-4">
                            <p className="text-foreground whitespace-pre-wrap">{selectedEmail.body}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">Select an email to view its content.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Inbox;