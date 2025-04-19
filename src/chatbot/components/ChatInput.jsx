import React, { useState } from 'react';
import iconSendDisabled from '../../assets/icons/send_disabled.svg';
import iconSendDefault from '../../assets/icons/send_default.svg';
import '../styles/ChatInput.css';

function ChatInput({
  disabled,  // true = 入力不可（FAQモードなど）
  onSend
}) {
  const [text, setText] = useState('');

  // 入力内容が変わったとき
  const handleChange = (e) => {
    setText(e.target.value);

    // 自動で高さ調整
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // 送信処理
  const handleSend = () => {
    if (!disabled && text.trim()) {
      onSend(text);
      setText('');
    }
  };

  // Enterキー送信対応（Shift + Enterは改行）　任意で有効化してください。
  /*
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();  // 改行防止
      handleSend();        // 送信実行
    }
  };*/

  // アイコン切り替え（disabled時はグレー）
  const iconSrc = disabled ? iconSendDisabled : iconSendDefault;

  return (
    <div className={`chat-input ${disabled ? 'chat-input-disabled' : ''}`}>
      <textarea
        value={text}
        onChange={handleChange}
        //onKeyDown={handleKeyDown} //enterキー送信
        disabled={disabled}
        placeholder={disabled ? 'オプションを選択してください' : 'メッセージを入力...'}
        rows="1"
        className="chat-input-field"
      />
      <button
        className="send-button"
        onClick={handleSend}
        disabled={disabled}
      >
        <img src={iconSrc} alt="送信ボタン" />
      </button>
    </div>
  );
}

export default ChatInput;