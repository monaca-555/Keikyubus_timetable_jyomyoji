# 鎌倉駅 → 岐れ路 バス時刻表(統合)

京急バス公式サイトは系統(路線)ごとにしか時刻表が見られず、同じバス停に来る全系統をまとめて見られないため不便。鎌倉駅を出発し「岐れ路」バス停を通過する全系統を、実際のバス停の時刻表のように1枚にまとめて表示するページ。

**⚠️ 現在の状態: `data/timetable.json` はダミー(サンプル)データです。** 京急バス公式サイトから実データを収集して置き換えるまでは、実際の発車時刻とは異なります。

## 構成

```
index.html          表示ページ本体
assets/style.css     バス停の時刻表掲示物を模したスタイル
assets/script.js      data/timetable.json を読み込んで描画
data/timetable.json   時刻表データ(系統一覧 + 平日/土曜/日曜祝日の発車時刻)
.github/workflows/deploy-pages.yml  main への push で GitHub Pages に自動デプロイ
```

## データの更新方法

`data/timetable.json` を実データで置き換える。フォーマット:

```jsonc
{
  "note": "画面上部の注意書き",
  "stop": "鎌倉駅",
  "via": "岐れ路",
  "generatedAt": "データ取得日",
  "routes": [
    { "id": "kama2", "code": "鎌2", "destination": "梶原", "color": "#e4572e" }
    // ... 岐れ路を通る全系統を列挙
  ],
  "schedule": {
    "weekday":  [ { "hour": 6, "departures": [ { "minute": 10, "route": "kama2" } ] } ],
    "saturday": [ /* 同じ形式 */ ],
    "holiday":  [ /* 同じ形式 */ ]
  }
}
```

- `routes[].id` と `schedule.*[].departures[].route` を対応させる。
- `routes[].color` は系統ごとのバッジ色(視認性のため、色だけでなく系統番号のテキストも必ず表示される)。
- 時間帯(`hour`)がない/`departures` が空の時間帯は「運行なし」と表示される。

データ取得元: 京急バス公式サイト (https://www.keikyu-bus.co.jp/ , https://timetablenavi.keikyu-bus.co.jp/) の鎌倉駅のりば案内・各系統時刻表。岐れ路を通過する系統はのりば案内や路線図で洩れなく確認すること。

## GitHub Pages の公開設定

このリポジトリには `.github/workflows/deploy-pages.yml` を用意済み。`main` ブランチに push すると自動でビルド・デプロイされる。**初回のみ**、リポジトリの Settings → Pages で「Source: GitHub Actions」を選択する必要がある(コードだけでは有効化されない、GitHub側の一度きりの設定)。
