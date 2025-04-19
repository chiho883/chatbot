// Earthモード用のGPT APIリクエスト処理を担当
// EarthProfile.descriptionをベースにプロンプトを構築し、Groq APIへ送信する
//ChatBot.jsxがhandleSendEarthMessageで呼び出す

import EarthProfile from '../profiles/EarthProfile';

// APIキーやエンドポイントは .env ファイルから取得
const API_KEY = process.env.REACT_APP_GROQ_API_KEY;
const ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// Earthモード専用のGPT通信関数
export async function fetchGPTResponse(userInput) {
    const prompt = `${EarthProfile.description}\nユーザーからの質問：${userInput}`;

    try {
        const response = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`,
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192', // Groqの無料プラン向けモデル
                messages: [
                    { role: 'system', content: prompt },
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        const message = data.choices?.[0]?.message?.content;
        return message || '回答を取得できませんでした。';
    } catch (error) {
        console.error('GPT APIエラー:', error);
        return '通信エラーが発生しました。';
    }
}