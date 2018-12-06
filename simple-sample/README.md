# simple-sample

## 概要

最小構成のNodeスクリプトです。指定したMACアドレスにscan&connectをかけにいき、接続後データ取得を開始します。

## Prerequisites 必要な外部パッケージ

事前に以下のパッケージを組み込んでください。jinsmemesdk-node-nobleとjinsmemesdk-node-noble-uwpはどちらか片方が必要です。

- jinsmemesdk-node-noble
    - Mac/Linuxに対応するnobleを利用したバージョン、Windowsで対応USB-BTを使用すると使用できますが、現在その方式はテストしていません。
    - License: [JINS MEME 利用規約](https://jins-meme.com/ja/terms)
    - ^0.9.13
    
- jinsmemesdk-node-noble-uwp
    - Windows10(Creators Update以降, build 10.0.15063 or later)に対応するnoble-uwpを利用したバージョン
    - License: [JINS MEME 利用規約](https://jins-meme.com/ja/terms)
    - ^0.9.13
    
## Sample使用手順

1. npm install '**Listed in prerequisites**'
1. meme_sample.js内のアプリ認証(app_id/app_secret)情報、接続するMEMEのMACアドレス(mac_addr_to_connect, **コロンなし小文字** )を記載
1. binding.nodeが無いとエラーが出た場合はリビルド rebuild if there is no 'binding.node' `npm rebuild --build_from_source=true`
1. `node meme_sample.js`
