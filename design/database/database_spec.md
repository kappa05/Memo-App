# データベース定義書

## 1. テーブル定義

### 1.1 users（ユーザー）
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 1.2 memos（メモ）
```sql
CREATE TABLE memos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 1.3 categories（カテゴリ）
```sql
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### 1.4 memo_categories（メモカテゴリ関連）
```sql
CREATE TABLE memo_categories (
    memo_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (memo_id, category_id),
    FOREIGN KEY (memo_id) REFERENCES memos(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 2. インデックス定義

### 2.1 既存のインデックス
- users.email
- memos.user_id
- memos.created_at
- categories.user_id
- memo_categories (memo_id, category_id)

### 2.2 追加インデックス
```sql
-- メモ検索用インデックス
CREATE FULLTEXT INDEX idx_memo_search ON memos(title, content);

-- カテゴリ名検索用インデックス
CREATE INDEX idx_category_name ON categories(name);
```

## 3. サンプルデータ

### 3.1 ユーザーデータ
```sql
INSERT INTO users (username, email, password) VALUES
('test_user', 'test@example.com', '$2a$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
```

### 3.2 カテゴリデータ
```sql
INSERT INTO categories (user_id, name) VALUES
(1, '仕事'),
(1, 'プライベート'),
(1, 'アイデア');
```

### 3.3 メモデータ
```sql
INSERT INTO memos (user_id, title, content) VALUES
(1, '会議メモ', '# 会議メモ\n\n## 議題\n- プロジェクト進捗\n- 次回の計画'),
(1, '買い物リスト', '# 買い物リスト\n\n- 牛乳\n- パン\n- 卵');
```

## 4. バックアップ戦略

### 4.1 バックアップ頻度
- フルバックアップ：日次
- 増分バックアップ：6時間ごと

### 4.2 バックアップ保持期間
- フルバックアップ：30日
- 増分バックアップ：7日

## 5. パフォーマンス最適化

### 5.1 テーブル最適化
```sql
-- 定期的なテーブル最適化
OPTIMIZE TABLE users;
OPTIMIZE TABLE memos;
OPTIMIZE TABLE categories;
OPTIMIZE TABLE memo_categories;
```

### 5.2 パーティショニング
```sql
-- メモテーブルのパーティショニング（作成日時ベース）
ALTER TABLE memos
PARTITION BY RANGE (UNIX_TIMESTAMP(created_at)) (
    PARTITION p_2024_01 VALUES LESS THAN (UNIX_TIMESTAMP('2024-02-01 00:00:00')),
    PARTITION p_2024_02 VALUES LESS THAN (UNIX_TIMESTAMP('2024-03-01 00:00:00')),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);
``` 