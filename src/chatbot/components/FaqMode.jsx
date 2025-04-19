// FAQモード専用のチャット画面（Message表示 + FAQ選択）

import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble.jsx';

function FaqMode({
    messages,            // メッセージ履歴
    faqs,                // 現在表示すべきFAQ一覧
    isLoading,           // ローディング状態
    setMessages,         // 会話内容を更新するための関数
    fetchFAQ             // FAQを取得する関数（API通信）
}) {

    const apiBaseUrl = process.env.REACT_APP_API_URL;

    const messagesEndRef = useRef(null);

    // FAQモードに入ったときの初期メッセージと親FAQ取得(初回のみ)
    useEffect(() => {
        if (messages.length === 0) { //チャットの履歴がない＝初回
            const welcomeMsg = {
                text: '質問したい内容を、下の選択肢から選んでください!',
                sender: 'bot',
                showIcon: true
            };
            setMessages([welcomeMsg]);
            fetchFAQ(null);
        }
    }, [messages, setMessages, fetchFAQ]);


    // オートスクロール（チャットが更新されるたびに、画面が一番下まで自動スクロール）
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);


    // FAQクリック処理
    const handleSelectFAQ = async (faq) => {
        const userMsg = {
            text: `${faq.question}について知りたい`,
            sender: 'user'
        };
        setMessages(prev => [...prev, userMsg]);

        setMessages(prev => [...prev, { text: '読み込み中...', sender: 'bot', showIcon: false }]);

        let childFaqs = []; //これから取りに行く子FAQ（次の質問）の配列
        try {
            const res = await fetch(`${apiBaseUrl}/api/faq?parent=${faq.id}`);
            childFaqs = await res.json();
        } catch (err) {
            console.error('子FAQ取得エラー:', err);
        }

        // ローディング削除
        setMessages(prev => prev.filter(msg => msg.text !== '読み込み中...'));

        if (childFaqs.length > 0) { //子FAQ（次の質問のボタン）が1個以上
            const botFirst = {
                text: `${faq.question}についてですね！`,
                sender: 'bot',
                showIcon: true
            };
            const botSecond = {
                text: 'どの内容について詳しく知りたいですか？',
                sender: 'bot',
                showIcon: false
            };
            setMessages(prev => [...prev, botFirst, botSecond]);
            fetchFAQ(faq.id);
        } else { //「子FAQが1個もなかったとき」の処理=最下層
            const botAnswer = {
                text: faq.answer || '回答がありません。',
                sender: 'bot',
                showIcon: true
            };

            // 関連リンク
            let linkMsg = null;
            try {
                //その質問に関連するリンクがあるか、サーバーに聞く
                const res = await fetch(`${apiBaseUrl}/api/faq/${faq.id}/links`);
                const links = await res.json();
                if (links.length > 0) {
                    linkMsg = {
                        sender: 'bot',
                        showIcon: false,
                        links: links
                    };
                }
            } catch (err) {
                console.error('リンク取得エラー:', err);

            }

            // 質問案内メッセージ
            const botAsk = {
                text: '他に聞きたいことはありますか？',
                sender: 'bot',
                showIcon: false
            };

            setMessages(prev => [
                ...prev,
                botAnswer,
                ...(linkMsg ? [linkMsg] : []),
                botAsk
            ]);

            fetchFAQ(null); //親FAQ表示
        }
    };


    return (
        <>
            {/* メッセージエリア */}
            {messages.map((msg, idx) => ( // 今までの会話（messages）を1つずつ取り出して表示
                <MessageBubble
                    key={idx}
                    message={msg}
                />
            ))}

            {/* FAQボタンエリア */}
            {faqs.length > 0 && (
                <div className="faq-button-area">
                    {faqs.map((faqItem) => (
                        <button
                            key={faqItem.id}
                            className="chat-question-button"
                            onClick={() => handleSelectFAQ(faqItem)}
                        >
                            {faqItem.question}
                        </button>
                    ))}
                </div>
            )}

            {/* ローディング */}
            {isLoading && (
                <div className="dots-loading">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            )}

            {/* オートスクロール用ダミー */}
            <div style={{ height: 50 }} />
            <div ref={messagesEndRef} />
        </>

    );
}

export default FaqMode;