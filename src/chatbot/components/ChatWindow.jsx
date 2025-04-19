import React from 'react';
import ModeSelect from './ModeSelect.jsx';
import FaqMode from './FaqMode.jsx';
import EarthMode from './EarthMode.jsx';
import ChatInput from './ChatInput.jsx';
import '../styles/ChatWindow.css';
import '../styles/ChatInput.css';
import closeIcon from '../../assets/icons/close.svg';
import arrowLeftIcon from '../../assets/icons/mode-back.svg';

function ChatWindow({
  currentMode,        // 現在のモード（null, 'faq', 'earth'）
  messages,           // メッセージ一覧
  faqs,               // FAQ一覧
  isLoading,          // ローディング状態
  handleSendMessage,  // 送信処理（faqのときはonSendMessage、earthの時はhandleSendEarthMessage）
  handleBack,         // チャットを閉じる処理
  setCurrentMode,      // モード切り替え（形式選択に戻る用）
  setMessages,        // メッセージ更新用
  fetchFAQ,           // FAQ取得用
  isLoadingGPT        // GPTローディング状態（Earthモード用）

}) {
  return (
    <div className="chatbot-window">

      {/* ヘッダー */}
      <div className="chatbot-header">
        {/* 形式選択に戻るボタン（モード選択以外で表示） */}
        {currentMode !== null && (
          <button
            className="back-button"
            onClick={() => setCurrentMode(null)}
          >
            <img src={arrowLeftIcon} alt="戻る" className="back-icon" />
            モード選択
          </button>
        )}

        {/* ヘッダー文言を currentMode に応じて表示 */}
        <span className="chatbot-title">
          {currentMode === 'faq' && '質問選択'}
          {currentMode === 'earth' && 'テキスト入力'}
          {currentMode === null && 'モード選択'}
        </span>


        <button
          className="chatbot-header-close"
          onClick={handleBack}
        >
          <img src={closeIcon} alt="チャットを閉じる" />
        </button>
      </div>

      {/* 本文エリア */}
      <div className="chatbot-messages">

        {/* currentModeがnullのとき */}
        {currentMode === null && (
          <ModeSelect onSelect={setCurrentMode} />
        )}

        {/* currentModeがfaqのとき */}
        {currentMode === 'faq' && (
          <FaqMode
            messages={messages}
            faqs={faqs}
            isLoading={isLoading}
            setMessages={setMessages}
            fetchFAQ={fetchFAQ}
          />
        )}

        {/* currentModeがearthのとき */}
        {currentMode === 'earth' && (
          <EarthMode
            messages={messages}
            handleSendEarthMessage={handleSendMessage}
            isLoadingGPT={isLoadingGPT}
            setMessages={setMessages}
          />
        )}

      </div>

      {/* 入力フィールド（Earthモードのときだけ表示） */}
      {currentMode === 'earth' && (
        <div className="chatbot-input-container">
          <div className="chatbot-input-area">
            <ChatInput
              disabled={isLoadingGPT}              // GPT応答中は入力不可
              onSend={handleSendMessage}     // GPT APIに送信
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default ChatWindow;