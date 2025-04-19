import React from 'react';
import botIcon from '../../assets/icons/bot-icon.png';
import earthIcon from '../../assets/icons/earth-icon.png';

function MessageBubble({ message }) {
  // messageの中身を取り出す
  const { sender, text, isOption, isOptionClicked, showIcon, links, jsx } = message;

  // senderによって名前とアイコンを決める
  let usedName = "";
  let usedIcon = "";

  if (sender === 'earth') {
    usedName = 'earth';
    usedIcon = earthIcon;
  } else if (sender === 'bot') {
    usedName = process.env.REACT_APP_BOT_NAME || "chatbot";
    usedIcon = process.env.REACT_APP_BOT_ICON || botIcon;
  }

  // ユーザー側の吹き出し
  if (sender === 'user') {
    return (
      <div className="user-message">
        <div className="user-text-block">
          <div className="message-bubble user-bubble">
            {text.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // bot/earth側の吹き出し
  return (
    <>
      <div className="bot-message-container">
        {/* アイコン */}
        <div className={showIcon ? "bot-icon-block" : "bot-icon-block no-icon"}>
          {showIcon && <img src={usedIcon} alt="bot-icon" className="bot-icon" />}
        </div>

        <div className="bot-text-block">
          {showIcon && <div className="bot-name">{usedName}</div>}

          <div className="message-bubble bot-bubble">
            {/* JSX優先 */}
            {jsx ? jsx :
              links && links.length > 0 ? (
                <>
                  <p>詳しくはこちらをご覧ください</p>
                  <ul>
                    {links.map((lnk, idx) => (
                      <li key={idx}>
                        <a href={lnk.link_url} target="_blank" rel="noopener noreferrer">
                          {lnk.link_text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                text.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))
              )
            }
          </div>
        </div>
      </div>

    </>
  );
}

export default MessageBubble;