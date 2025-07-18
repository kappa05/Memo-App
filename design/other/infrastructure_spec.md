# インフラストラクチャ設計書

## 1. システム構成

### 1.1 全体構成
```
[クライアント]
    ↓ HTTPS
[CloudFront]
    ↓ HTTPS
[ALB]
    ↓ HTTPS
[EC2 (Spring Boot)]
    ↓ TCP
[RDS (MySQL)]
```

### 1.2 環境構成
- 開発環境
- ステージング環境
- 本番環境

## 2. AWSリソース構成

### 2.1 コンピューティング
- EC2
  - インスタンスタイプ：t3.small
  - オートスケーリング設定
    - 最小：2台
    - 最大：4台
    - スケールアウト条件：CPU使用率70%以上
    - スケールイン条件：CPU使用率30%以下

### 2.2 データベース
- RDS
  - インスタンスタイプ：db.t3.small
  - マルチAZ構成
  - バックアップ設定
    - 自動バックアップ：日次
    - 保持期間：30日
  - パラメータグループ
    - 文字コード：utf8mb4
    - タイムゾーン：Asia/Tokyo

### 2.3 ネットワーク
- VPC
  - パブリックサブネット：2AZ
  - プライベートサブネット：2AZ
- ALB
  - ヘルスチェック設定
  - SSL証明書設定
- Route 53
  - ドメイン設定
  - ヘルスチェック設定

### 2.4 ストレージ
- S3
  - バックアップ保存
  - 静的ファイル保存
- EBS
  - アプリケーションログ
  - システムログ

## 3. 監視・アラート設定

### 3.1 CloudWatch
- メトリクス監視
  - CPU使用率
  - メモリ使用率
  - ディスク使用率
  - ネットワークトラフィック
- ログ監視
  - アプリケーションログ
  - アクセスログ
  - エラーログ

### 3.2 アラート設定
- 高CPU使用率（80%以上）
- 高メモリ使用率（80%以上）
- ディスク容量不足（80%以上）
- エラー率上昇（5%以上）

## 4. バックアップ・リカバリ

### 4.1 バックアップ対象
- データベース
- アプリケーションログ
- 設定ファイル
- ユーザーデータ

### 4.2 バックアップ方式
- 自動バックアップ
  - 頻度：日次
  - 保持期間：30日
- 手動バックアップ
  - 頻度：月次
  - 保持期間：1年

### 4.3 リカバリ手順
1. バックアップの選択
2. リカバリ環境の準備
3. データの復元
4. 動作確認
5. 本番環境への反映

## 5. セキュリティ設定

### 5.1 ネットワークセキュリティ
- セキュリティグループ
  - インバウンドルール
  - アウトバウンドルール
- NACL設定
- WAF設定

### 5.2 アクセス管理
- IAMロール
- IAMポリシー
- キーローテーション

## 6. コスト最適化

### 6.1 リソース最適化
- インスタンスタイプの選択
- ストレージの最適化
- バックアップの最適化

### 6.2 コスト監視
- 予算アラート設定
- コスト分析
- 使用量レポート

## 7. 運用管理

### 7.1 デプロイメント
- CI/CDパイプライン
  - ソースコード管理
  - ビルド
  - テスト
  - デプロイ
- ロールバック手順

### 7.2 メンテナンス
- パッチ適用
- セキュリティアップデート
- バックアップテスト
- パフォーマンスチューニング 