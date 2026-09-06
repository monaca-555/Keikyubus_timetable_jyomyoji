# 鎌倉駅 ⇔ 岐れ道 バス時刻表(統合)

京急バス公式サイトは系統(路線)ごとにしか時刻表が見られず、同じバス停に来る全系統をまとめて見られないため不便。「岐れ道」バス停を通過する全系統を、鎌倉駅→岐れ道方面・岐れ道→鎌倉駅方面の両方向について、実際のバス停の時刻表のように1枚にまとめて表示するページ。画面上部のボタンで方向を切り替えられる。

`data/timetable.json`(鎌倉駅→岐れ道方面)・`data/timetable_inbound.json`(岐れ道→鎌倉駅方面)は実データです(2026-09-07時点、駅探掲載の京急バス時刻表より収集、NAVITIME掲載データとも一部照合済み)。岐れ道を通過する系統は鎌20(大塔宮)・鎌23(鎌倉霊園正門前太刀洗)・鎌24(金沢八景駅)・鎌36(ハイランド循環)の4系統。ダイヤ改正時は最新の時刻表で更新すること。

## 構成

```
index.html                    表示ページ本体
assets/style.css               バス停の時刻表掲示物を模したスタイル
assets/script.js                data/timetable*.json を読み込んで描画、方向切り替えを制御
data/timetable.json            時刻表データ(鎌倉駅→岐れ道方面。系統一覧 + 平日/土曜/日曜祝日の発車時刻)
data/timetable_inbound.json    時刻表データ(岐れ道→鎌倉駅方面。フォーマットは同じ)
.github/workflows/deploy-pages.yml  main への push で GitHub Pages に自動デプロイ
```

## データの更新方法

`data/timetable.json`(鎌倉駅発)・`data/timetable_inbound.json`(岐れ道発)をそれぞれ実データで置き換える。フォーマットは共通:

```jsonc
{
  "note": "画面上部の注意書き",
  "stop": "鎌倉駅",
  "via": "岐れ道",
  "generatedAt": "データ取得日",
  "routes": [
    { "id": "kama2", "code": "鎌2", "destination": "梶原", "color": "#e4572e" }
    // ... 岐れ道を通る全系統を列挙
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

データ取得元: 京急バス公式サイト (https://www.keikyu-bus.co.jp/ , https://timetablenavi.keikyu-bus.co.jp/) の鎌倉駅のりば案内・各系統時刻表。岐れ道を通過する系統はのりば案内や路線図で洩れなく確認すること。

## GitHub Pages の公開設定

このリポジトリには `.github/workflows/deploy-pages.yml` を用意済み。`main` ブランチに push すると自動でビルド・デプロイされる。**初回のみ**、リポジトリの Settings → Pages で「Source: GitHub Actions」を選択する必要がある(コードだけでは有効化されない、GitHub側の一度きりの設定)。
