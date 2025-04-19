import React from 'react';
import MessageBubble from './MessageBubble.jsx';

function MessageList({ messages }) {
    return (
        <div className="message-list">
            {messages.map((msg, idx) => (
                <MessageBubble
                    key={idx}
                    message={msg}
                />
            ))}
        </div>
    );
}

export default MessageList;