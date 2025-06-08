# インターフェース仕様書

## 1. API共通仕様

### 1.1 基本情報
- ベースURL: `https://api.memoapp.com/v1`
- 認証方式: JWT（JSON Web Token）
- レスポンス形式: JSON
- 文字コード: UTF-8

### 1.2 共通ヘッダー
```
Authorization: Bearer {token}
Content-Type: application/json
Accept: application/json
```

### 1.3 エラーレスポンス形式
```json
{
    "error": {
        "code": "ERROR_CODE",
        "message": "エラーメッセージ",
        "details": {
            "field": "エラーが発生したフィールド",
            "reason": "エラーの詳細"
        }
    }
}
```

## 2. 認証API

### 2.1 ユーザー登録
- エンドポイント: `POST /auth/register`
- リクエスト:
```json
{
    "username": "string",
    "email": "string",
    "password": "string"
}
```
- レスポンス:
```json
{
    "id": "number",
    "username": "string",
    "email": "string",
    "token": "string"
}
```

### 2.2 ログイン
- エンドポイント: `POST /auth/login`
- リクエスト:
```json
{
    "email": "string",
    "password": "string"
}
```
- レスポンス:
```json
{
    "token": "string",
    "user": {
        "id": "number",
        "username": "string",
        "email": "string"
    }
}
```

## 3. メモAPI

### 3.1 メモ一覧取得
- エンドポイント: `GET /memos`
- クエリパラメータ:
  - page: ページ番号（デフォルト: 1）
  - size: 1ページあたりの件数（デフォルト: 20）
  - sort: ソート順（created_at, updated_at, title）
  - category: カテゴリID
  - search: 検索キーワード
- レスポンス:
```json
{
    "content": [
        {
            "id": "number",
            "title": "string",
            "content": "string",
            "categories": [
                {
                    "id": "number",
                    "name": "string"
                }
            ],
            "created_at": "string",
            "updated_at": "string"
        }
    ],
    "total_elements": "number",
    "total_pages": "number",
    "current_page": "number"
}
```

### 3.2 メモ作成
- エンドポイント: `POST /memos`
- リクエスト:
```json
{
    "title": "string",
    "content": "string",
    "category_ids": ["number"]
}
```
- レスポンス:
```json
{
    "id": "number",
    "title": "string",
    "content": "string",
    "categories": [
        {
            "id": "number",
            "name": "string"
        }
    ],
    "created_at": "string",
    "updated_at": "string"
}
```

### 3.3 メモ更新
- エンドポイント: `PUT /memos/{id}`
- リクエスト:
```json
{
    "title": "string",
    "content": "string",
    "category_ids": ["number"]
}
```
- レスポンス:
```json
{
    "id": "number",
    "title": "string",
    "content": "string",
    "categories": [
        {
            "id": "number",
            "name": "string"
        }
    ],
    "created_at": "string",
    "updated_at": "string"
}
```

## 4. カテゴリAPI

### 4.1 カテゴリ一覧取得
- エンドポイント: `GET /categories`
- レスポンス:
```json
[
    {
        "id": "number",
        "name": "string",
        "memo_count": "number"
    }
]
```

### 4.2 カテゴリ作成
- エンドポイント: `POST /categories`
- リクエスト:
```json
{
    "name": "string"
}
```
- レスポンス:
```json
{
    "id": "number",
    "name": "string",
    "memo_count": "number"
}
```

## 5. エラーコード一覧

### 5.1 認証エラー
- AUTH001: 認証トークンが無効
- AUTH002: 認証トークンの有効期限切れ
- AUTH003: アクセス権限なし

### 5.2 バリデーションエラー
- VAL001: 必須項目が未入力
- VAL002: メールアドレスの形式が不正
- VAL003: パスワードの要件を満たしていない

### 5.3 ビジネスロジックエラー
- BIZ001: メモが見つからない
- BIZ002: カテゴリが見つからない
- BIZ003: 重複するカテゴリ名

### 5.4 システムエラー
- SYS001: サーバー内部エラー
- SYS002: データベースエラー
- SYS003: 外部サービスエラー 