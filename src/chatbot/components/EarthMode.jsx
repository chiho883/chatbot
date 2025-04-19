// Earthモード用のチャット画面（GPTとのやり取りを行う）

import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble.jsx';
import EarthProfile from '../profiles/EarthProfile.js';

function EarthMode({
    messages,                // メッセージ履歴
    handleSendEarthMessage,  // GPT送信用
    isLoadingGPT,            // GPTローディング状態
    setMessages              // 会話内容を更新するための関数
}) {
    const messagesEndRef = useRef(null);

    // --- 初期メッセージ表示（1回のみ）--- //
    useEffect(() => {
        if (messages.length === 0) {
            const welcomeMsgs = EarthProfile.welcomeMessages.map((text, index) => ({
                text,
                sender: 'earth',
                showIcon: index === 0,
            }));
            setMessages(welcomeMsgs);
        }
    }, [messages, setMessages]);



    // オートスクロール
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>

            {messages.map((msg, idx) => (
                <MessageBubble key={idx} message={msg} />
            ))}

            {/* GPTローディング中の表示 */}
            {isLoadingGPT && (
                <div className="dots-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            )}

            {/* ダミー要素（スクロール位置） */}
            <div style={{ height: 50 }} />
            <div ref={messagesEndRef} />

        </>
    );
}

export default EarthMode;