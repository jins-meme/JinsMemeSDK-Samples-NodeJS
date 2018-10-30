# jinsmeme-mouse

## 概要

JINS MEME をマウスの代わりに動作させるelectronアプリです。

## バイナリ

releases をご覧ください。

## 使用法

- JINSMEMEをアドバタイズモードにして Startでスキャン開始
- JINS MEMEが見つかったら選択
- 接続後の操作
    - カーソル移動: 顔の上下・左右
    - スクロール: 首を傾ける
    - シングルクリック(左): まばたき
    - 右クリック: ゆっくりしたまばたき
    - ドラッグ開始: まばたき2回
- Windowsの場合、優先度高いアプリ・自身に対してコントロールは失われます。管理者で実行するとどのアプリケーションも操作することが可能です。

## Prerequisites for build ビルドに必要な外部パッケージ

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
    - ^3.0.6

- electron-store
    - License: MIT
    - ^2.0.0    

- robotjs
    - mouseやkeyboardを操作するライブラリ
    - License: MIT
    - ^0.5.11

## Using external script/css 使用している外部スクリプト/css

electronサンプルでは以下のUIライブラリを使用しています。

- onsen-ui
    - モバイルアプリケーションライブラリ
    - License: Apache License 2.0

## ビルド手順

1. git clone したあと、jinsmeme-mouse/src/main.js の以下のSDK読み込み個所を必要に応じて修正してください
    - Windows 10：`const memeDevice = require('jinsmemesdk-node-noble-uwp');` 
    - Mac/Linux：`const memeDevice = require('jinsmemesdk-node-noble');` 
1. package.json の dependencies も jinsmemesdk-node-noble-uwp, jinsmemesdk-node-noble を必要に応じて修正
1. npm install '**Listed in prerequisites**'
1. main.js内のアプリ認証(app_id/app_secret)情報、接続するMEMEのMACアドレス(mac_addr_to_connect, **コロンなし小文字** )を記載
1. [Electronのリビルド](http://robotjs.io/docs/electron)
    ```
    npm rebuild --runtime=electron --target=3.0.6 --arch=x64 --rebuild --disturl=https://atom.io/download/electron --build_from_source=true --abi=64
    ```
    ここでUSB周りのビルドエラーが出るときは [micro:bit を Scratch 2 + Bluetooth で使う](https://qiita.com/memakura/items/dc5cf2ff39d24ceb53ff) を参考にusb/libusb/libusb/strerror.c のソースを修正しリビルド
1. `npx electron src`