const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// ミドルウェアの設定
app.use(cors());
app.use(bodyParser.json());

// ログ出力用のミドルウェア
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request Body:', req.body);
  }
  next();
});

// 初期データの定義
const getInitialData = () => ({
  memos: [
    {
      id: 1,
      title: 'サンプルメモ1',
      content: 'これはサンプルメモの内容です。',
      category: '仕事',
      createdAt: '2024-03-20T10:00:00Z',
      updatedAt: '2024-03-20T10:00:00Z'
    },
    {
      id: 2,
      title: 'サンプルメモ2',
      content: 'もう一つのサンプルメモです。',
      category: 'プライベート',
      createdAt: '2024-03-20T11:00:00Z',
      updatedAt: '2024-03-20T11:00:00Z'
    }
  ],
  categories: [
    {
      id: 1,
      name: '仕事',
      color: 'blue'
    },
    {
      id: 2,
      name: 'プライベート',
      color: 'green'
    },
    {
      id: 3,
      name: '買い物',
      color: 'orange'
    }
  ]
});

// データの初期化
let { memos, categories } = getInitialData();

// リセット用のエンドポイント
app.post('/api/reset', (req, res) => {
  const initialData = getInitialData();
  memos = initialData.memos;
  categories = initialData.categories;
  console.log('データをリセットしました');
  res.json({ message: 'データをリセットしました', data: initialData });
});

// メモ関連のエンドポイント
app.get('/api/memos', (req, res) => {
  console.log('Response:', memos);
  res.json(memos);
});

app.post('/api/memos', (req, res) => {
  const newMemo = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  memos.push(newMemo);
  console.log('Created Memo:', newMemo);
  res.status(201).json(newMemo);
});

app.put('/api/memos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = memos.findIndex(memo => memo.id === id);
  if (index === -1) {
    console.log('Memo not found:', id);
    return res.status(404).json({ message: 'メモが見つかりません' });
  }
  const updatedMemo = {
    ...memos[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };
  memos[index] = updatedMemo;
  console.log('Updated Memo:', updatedMemo);
  res.json(updatedMemo);
});

app.delete('/api/memos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = memos.findIndex(memo => memo.id === id);
  if (index === -1) {
    console.log('Memo not found:', id);
    return res.status(404).json({ message: 'メモが見つかりません' });
  }
  const deletedMemo = memos[index];
  memos = memos.filter(memo => memo.id !== id);
  console.log('Deleted Memo:', deletedMemo);
  res.status(204).send();
});

// カテゴリー関連のエンドポイント
app.get('/api/categories', (req, res) => {
  console.log('Response:', categories);
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const newCategory = {
    id: Date.now(),
    ...req.body
  };
  categories.push(newCategory);
  console.log('Created Category:', newCategory);
  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(category => category.id === id);
  if (index === -1) {
    console.log('Category not found:', id);
    return res.status(404).json({ message: 'カテゴリーが見つかりません' });
  }
  const updatedCategory = {
    ...categories[index],
    ...req.body
  };
  categories[index] = updatedCategory;
  console.log('Updated Category:', updatedCategory);
  res.json(updatedCategory);
});

app.delete('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(category => category.id === id);
  if (index === -1) {
    console.log('Category not found:', id);
    return res.status(404).json({ message: 'カテゴリーが見つかりません' });
  }
  const deletedCategory = categories[index];
  categories = categories.filter(category => category.id !== id);
  console.log('Deleted Category:', deletedCategory);
  res.status(204).send();
});

// 認証関連のエンドポイント
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email, password });
  // 簡易的な認証（実際のアプリケーションでは適切な認証処理を実装する）
  if (email === 'test@example.com' && password === 'password') {
    const response = {
      token: 'mock-jwt-token',
      user: {
        id: 1,
        email: 'test@example.com',
        name: 'テストユーザー'
      }
    };
    console.log('Login successful:', response);
    res.json(response);
  } else {
    console.log('Login failed: Invalid credentials');
    res.status(401).json({ message: 'メールアドレスまたはパスワードが正しくありません' });
  }
});

// サーバーの起動
app.listen(port, () => {
  console.log(`モックサーバーが起動しました: http://localhost:${port}`);
}); 