// Earthモードでのやり取り（ユーザー入力とGPT回答）をDBに保存するAPI呼び出し処理
// ChatBot.jsxのhandleSendEarthMessage内で呼び出される


import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_URL;

// DBにチャットログを保存する関数
export async function saveChatLog(userMessage, botResponse) {
    try {
        await axios.post(`${apiBaseUrl}/api/chat-log`, {
            user_message: userMessage,
            bot_response: botResponse,
        });
    } catch (error) {
        console.error('チャットログ保存エラー:', error);
    }
}