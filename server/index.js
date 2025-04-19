// .env を読み込む
require('dotenv').config();


const express = require('express');
const mysql = require('mysql2');

const port = process.env.PORT;

const app = express();

//CORS設定: 
const cors = require('cors');
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : [];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ◆ JSONボディをパースする設定
app.use(express.json());

// ◆ MySQL接続設定
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


//親子FAQを取得
app.get('/api/faq', (req, res) => {
  const parent = req.query.parent;
  let sql = 'SELECT * FROM faq';
  const params = [];

  if (parent !== undefined) {
    if (parent === 'null') {
      sql += ' WHERE parent_id IS NULL';
    } else {
      sql += ' WHERE parent_id = ?';
      params.push(parent);
    }
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('SQL Error:', err);
      return res.status(500).send('データ取得エラー');
    }
    res.json(results);
  });
});

//チャットログ保存（Earthモード）
app.post('/api/chat-log', (req, res) => {
  const { user_message, bot_response } = req.body;

  const sql = 'INSERT INTO chat_log (user_message, gpt_reply) VALUES (?, ?)';
  db.query(sql, [user_message, bot_response], (err, result) => {
    if (err) {
      console.error('チャットログ保存エラー:', err);
      return res.status(500).send('保存エラー');
    }
    res.status(201).json({ message: '保存成功', id: result.insertId });
  });
});


//関連FAQを取得（今後実装する可能性あり）
/*
app.get('/api/faq/:id/related', (req, res) => {
    const faqId = req.params.id;
    const sql = `
      SELECT f.*
      FROM faq_related r
      JOIN faq f ON f.id = r.related_faq_id
      WHERE r.faq_id = ?
    `;
  
    db.query('SELECT * FROM faq WHERE parent_id=?', [someParent], (err, results) => {
      if (err) {
        console.error('関連FAQ取得エラー:', err);
        return res.status(500).send('関連FAQ取得エラー');
      }
      res.json(results);
    });
});
*/

//複数のリンクを取得
app.get('/api/faq/:id/links', (req, res) => {
  const faqId = req.params.id;
  const sql = `
    SELECT link_url, link_text
    FROM faq_links
    WHERE faq_id = ?
  `;

  db.query(sql, [faqId], (err, results) => {
    if (err) {
      console.error('リンク取得エラー:', err);
      return res.status(500).json({ error: 'リンク取得エラー' });
    }
    res.json(results);
  });
});


/*
//デバッグ用
db.query('SELECT DATABASE()', (err, results) => {
    console.log('Using DB:', results);
});
db.query('SHOW TABLES', (err, results) => {
    console.log('Tables:', results);
});

db.query('SELECT DATABASE() as dbname', (err, results) => {
  if (err) {
    console.error('Error checking DB:', err);
  } else {
    console.log('Using DB object:', results); 
    if (results && results[0]) {
      console.log('DB Name =', results[0].dbname);
    }
  }
});

db.query('SHOW TABLES', (err, results) => {
  if (err) {
    console.error('SHOW TABLES Error:', err);
  } else {
    console.log('Tables:', results);
  }
});*/

//サーバー起動
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});