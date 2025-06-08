# バックエンド機能定義書

## 1. 技術スタック
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- MySQL 8.0
- Maven
- JUnit 5（テスト）

## 2. パッケージ構成
```
com.memoapp
├── config/          # 設定クラス
├── controller/      # RESTコントローラー
├── service/         # ビジネスロジック
├── repository/      # データアクセス
├── model/          # エンティティ
├── dto/            # データ転送オブジェクト
├── exception/      # 例外クラス
└── util/           # ユーティリティ
```

## 3. 主要コンポーネント

### 3.1 認証関連
- SecurityConfig
  - セキュリティ設定
  - 認証・認可ルール
- JwtTokenProvider
  - JWTトークン生成・検証
- UserDetailsServiceImpl
  - ユーザー認証処理

### 3.2 メモ関連
- MemoController
  - メモCRUD操作
  - 検索・フィルタリング
- MemoService
  - メモビジネスロジック
- MemoRepository
  - メモデータアクセス

### 3.3 カテゴリ関連
- CategoryController
  - カテゴリCRUD操作
- CategoryService
  - カテゴリビジネスロジック
- CategoryRepository
  - カテゴリデータアクセス

## 4. APIエンドポイント

### 4.1 認証API
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/reset-password

### 4.2 メモAPI
- GET /api/memos
- GET /api/memos/{id}
- POST /api/memos
- PUT /api/memos/{id}
- DELETE /api/memos/{id}
- GET /api/memos/search

### 4.3 カテゴリAPI
- GET /api/categories
- POST /api/categories
- PUT /api/categories/{id}
- DELETE /api/categories/{id}

## 5. セキュリティ対策
- JWT認証
- パスワードハッシュ化
- CSRF対策
- XSS対策
- SQLインジェクション対策
- レート制限

## 6. エラーハンドリング
- グローバル例外ハンドラー
- カスタム例外クラス
- エラーレスポンス形式

## 7. バリデーション
- 入力値バリデーション
- ビジネスルールバリデーション
- カスタムバリデーター

## 8. ロギング
- アプリケーションログ
- アクセスログ
- エラーログ
- 監査ログ

## 9. キャッシュ戦略
- メモデータのキャッシュ
- カテゴリデータのキャッシュ
- キャッシュ無効化戦略

## 10. テスト戦略
- 単体テスト
- 統合テスト
- E2Eテスト
- パフォーマンステスト 