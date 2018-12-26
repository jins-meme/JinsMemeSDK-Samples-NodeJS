# electron-sample

## 概要

electronで2台のJINS MEMEに接続するサンプルです。mainプロセスでJINS MEMEのハンドリングをします。

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

- electron
    - License: MIT
    - ^3.0.6 (4.0.0でも動作確認済みです)

- electron-store
    - License: MIT
    - ^2.0.0    

## Using external script/css 使用している外部スクリプト/css

electronサンプルでは以下のUIライブラリを使用しています。

- onsen-ui
    - モバイルアプリケーションライブラリ
    - License: Apache License 2.0

## Sample使用手順

1. git clone したあと、electron-sample/src/main.js の以下のSDK読み込み個所を必要に応じて修正してください
    - Windows 10：`const memeDevice = require('jinsmemesdk-node-noble-uwp');` 
    - Mac/Linux：`const memeDevice = require('jinsmemesdk-node-noble');` 
1. package.json の dependencies も jinsmemesdk-node-noble-uwp, jinsmemesdk-node-noble を必要に応じて修正
1. npm install '**Listed in prerequisites**'
1. main.js内のアプリ認証(app_id/app_secret)情報、接続するMEMEのMACアドレス(mac_addr_to_connect, **コロンなし小文字** )を記載
1. Electronのリビルド [Building for electron](https://github.com/jasongin/noble-uwp)
    ```
    npm rebuild --runtime=electron --target=3.0.6 --arch=x64 --rebuild --disturl=https://atom.io/download/electron --build_from_source=true
    ```
    - Windows-Build-Toolsは必ず **--vs2015** をつけてインストール
    - USB周りのビルドエラーが出るときは [micro:bit を Scratch 2 + Bluetooth で使う](https://qiita.com/memakura/items/dc5cf2ff39d24ceb53ff) を参考にusb/libusb/libusb/strerror.c のソースを修正しリビルド
1. `npx electron src`
