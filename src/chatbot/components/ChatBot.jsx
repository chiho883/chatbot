// チャットボット全体の親コンポーネント  状態管理と画面切り替えのみを担当

import React, { useState, useEffect } from 'react';
import ChatWindow from './ChatWindow.jsx';
import { fetchGPTResponse } from '../api/gptRequest';
import { saveChatLog } from '../api/saveChatLog';
import axios from 'axios';
import '../styles/ChatBot.css';
import openIcon from '../../assets/icons/open.svg';
import closeIcon from '../../assets/icons/close.svg';

function ChatBot() {

  // --- state定義 --- //

  const [isOpen, setIsOpen] = useState(false);         // チャット開閉
  const [currentMode, setCurrentMode] = useState(null); // モード(null, 'faq', 'earth')
  const [faqMessages, setFaqMessages] = useState([]); //FAQのメッセージ履歴の配列
  const [earthMessages, setEarthMessages] = useState([]); //Earthのメッセージ履歴の配列
  const [faqs, setFaqs] = useState([]);                // FAQデータ
  const [isLoading, setIsLoading] = useState(false);   // ローディング状態
  const [visible, setVisible] = useState(false);       // チャットボタンを表示/非表示
  const [showBubble, setShowBubble] = useState(true);  // 吹き出し表示
  const [isLoadingGPT, setIsLoadingGPT] = useState(false); // GPTのローディング状態（Earthモード用）


  const apiBaseUrl = process.env.REACT_APP_API_URL;


  // --- スクロールによる表示制御 --- //
  useEffect(() => {
    const scrollThreshold = 2000;
    const handleScroll = () => {
      if (!visible && window.scrollY > scrollThreshold) {
        setVisible(true);
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visible]);


  // --- チャットの開閉制御（状態維持版）--- //
  const toggleChat = () => {
    if (!isOpen) {
      // 開くとき → 何もしない（状態維持）
      setShowBubble(false);
    }
    setIsOpen(!isOpen); // 開閉切り替えだけ
  };


  // --- FAQデータ取得処理 --- //
  const fetchFAQ = async (parentId) => {
    setIsLoading(true);
    let url = `${apiBaseUrl}/api/faq`;
    url += parentId === null ? '?parent=null' : `?parent=${parentId}`;

    try {
      const res = await axios.get(url);
      setFaqs(res.data);
    } catch (err) {
      console.error('FAQ取得エラー:', err);
    } finally {
      setIsLoading(false);
    }
  };


  // FAQモードのときのメッセージ送信処理 //
  const handleSendFaqMessage = (newMessage) => {
    setFaqMessages(prev => [...prev, newMessage]);
  };


  // Earthモードのときのメッセージ送信処理
  const handleSendEarthMessage = async (text) => {
    const userMsg = { text, sender: 'user', isEarth: true };
    setEarthMessages(prev => [...prev, userMsg]);

    setIsLoadingGPT(true);

    try {
      const reply = await fetchGPTResponse(text);

      const botMsg = { text: reply, sender: 'earth', showIcon: true };
      setEarthMessages(prev => [...prev, botMsg]);

      //ユーザー発言とGPT回答を保存
      await saveChatLog(text, reply);

    } catch (error) {
      console.error('GPT通信エラー:', error);

      const errorMsg = {
        text: 'エラーが発生しました。もう一度お試しください。',
        sender: 'earth',
        showIcon: true
      };
      setEarthMessages(prev => [...prev, errorMsg]);

    } finally {
      setIsLoadingGPT(false);
    }
  };


  // --- 表示制御 --- //
  if (!visible) return null;



  return (
    <div>
      {/* チャット開閉ボタン */}
      <button className="chatbot-toggle" onClick={toggleChat}>
        {isOpen ? (
          <img src={closeIcon} alt="チャットを閉じる" />
        ) : (
          <img src={openIcon} alt="チャットを開く" />
        )}
      </button>

      {/* 吹き出し */}
      {visible && !isOpen && showBubble && (
        <>
          <button className="chat-bubble-close" onClick={() => setShowBubble(false)} />
          <div className="chat-bubble">
            <p>このチャットから<br />ポートフォリオの案内や<br />私のことを気軽に知れます！</p>
            <p>こちらのボタンをクリックすると<br />チャットを開始できます。</p>
          </div>
        </>
      )}

      {/* チャット本体 */}
      {isOpen && (
        // ChatWindowコンポーネントに状態を渡して表示内容を切り替える
        // currentModeの値によって次の画面が表示される
        // ・null  → ModeSelect（モード選択画面）
        // ・'faq' → FAQモード画面
        // ・'earth' → Earthモード画面
        <ChatWindow
          currentMode={currentMode} //モード状態
          messages={currentMode === 'faq' ? faqMessages : earthMessages}
          faqs={faqs}
          isLoading={isLoading}
          handleSendMessage={
            currentMode === 'earth' ? handleSendEarthMessage : handleSendFaqMessage
          } // メッセージ送信（モードによって処理分岐）
          handleBack={toggleChat}
          setCurrentMode={setCurrentMode} //モード切り替え
          setMessages={currentMode === 'faq' ? setFaqMessages : setEarthMessages}
          fetchFAQ={fetchFAQ}
          isLoadingGPT={isLoadingGPT}
        />
      )}
    </div>
  );
}

export default ChatBot;