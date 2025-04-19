import React from 'react';
import botIcon from '../../assets/icons/bot-icon.png';
import '../styles/ModeSelect.css';

function ModeSelect({ onSelect }) {

    //アイコンと名前を切り替え//
    const usedName = process.env.REACT_APP_BOT_NAME || 'chatbot';
    const usedIcon = process.env.REACT_APP_BOT_ICON || botIcon;

    //Earthモードの無効化フラグ
    const isEarthDisabled = false;

    return (
        <div className="mode-select">

            {/* bot側の吹き出し*/}
            <div className="bot-message-container">
                <div className="bot-icon-block">
                    <img src={usedIcon} alt="bot-icon" className="bot-icon" />
                </div>

                <div className="bot-text-block">
                    <div className="bot-name">{usedName}</div>

                    <div className="message-bubble bot-bubble">
                        <p>ようこそ！<br></br>ここではポートフォリオについてやスキル、私自身のことを知ることができます。 </p>
                        <p>気になることがあれば、気軽に聞いてくださいね。</p>
                        <p>質問方法は「FAQ形式」と「テキスト入力」から選べます。</p>
                    </div>
                </div>
            </div>

            {/* モード選択ボタン */}
            <div className="mode-select-buttons">
                <button
                    className="mode-select-button faq"
                    onClick={() => onSelect('faq')}
                >
                    FAQから質問を選ぶ
                </button>


                <button
                    className={`mode-select-button earth ${isEarthDisabled ? 'disabled' : ''}`} // ← className変更
                    onClick={() => {
                        if (!isEarthDisabled) onSelect('earth');
                    }}
                    disabled={isEarthDisabled}
                >
                    テキスト入力で質問する
                </button>

                {/* 無効化時の案内メッセージ */}
                {isEarthDisabled && (
                    <div className="earth-disabled-message">
                        ※テキスト入力は現在ご利用できません
                    </div>
                )}
            </div>
        </div>
    );
}

export default ModeSelect;