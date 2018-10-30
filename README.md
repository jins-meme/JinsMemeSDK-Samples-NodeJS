# JinsMemeSDK-Samples-NodeJS

A Node.js application samples for JinsMemeSDK-NodeJS 

JinsMemeSDK-NodeJSを利用したNode.jsサンプルです。

## 概要

以下の3サンプルを収録しています。

- simple-sample: 最短構成のNodeスクリプトです。指定したMACアドレスにscan&connectをかけにいき、接続後データ取得を開始します。
- electron-sample: electronで2台のJINS MEMEに接続するサンプルです。mainプロセスでJINS MEMEのハンドリングをします。
- jinsmeme-mouse: JINS MEME でマウスを操作するelectronアプリです。

## License

MIT

## Prerequisites 必要な外部パッケージ

事前に以下のパッケージを組み込んでください。jinsmemesdk-node-nobleとjinsmemesdk-node-noble-uwpはどちらか片方が必要です。

- jinsmemesdk-node-noble
    - Mac/Linuxに対応するnobleを利用したバージョン、Windowsで対応USB-BTを使用すると使用できますが、現在その方式はサポートしていません。
    - License: [JINS MEME 利用規約](https://jins-meme.com/ja/terms)
    - ^0.9.11
    
- jinsmemesdk-node-noble-uwp
    - Windows10(Creators Update以降, build 10.0.15063 or later)に対応するnoble-uwpを利用したバージョン
    - [JINS MEME 利用規約](https://jins-meme.com/ja/terms)
    - ^0.9.11
    
- electron (for electron-sample and jinsmeme-mouse)
    - License: MIT
    - ^3.0.6

- electron-store
    - License: MIT
    - ^2.0.0

- robotjs (only for jinsmeme-mouse)
    - mouseやkeyboardを操作するライブラリ
    - License: MIT
    - ^0.5.11

## Using external script/css 使用している外部スクリプト/css

electronサンプルでは以下のライブラリを使用しています。

- onsen-ui
    - モバイルアプリケーションライブラリ
    - License: MIT
    
## Sampleと使用手順

- 共通
    - 手順
        1. git clone https://github.com/jins-meme/JinsMemeSDK-Samples-NodeJS.git
        1. npm install '**Prerequisites**'

- simple-sample
    - 手順
        1. meme_sample.js内のアプリ認証(app_id/app_secret)情報、接続するMEMEのMACアドレスを小文字で記載(mac_addr_to_connect)
        1. `node meme_sample.js`
- electron-sample,meme_mouse
    - Files
        - package.json.mac: mac用(package.json にrenameして使用)
        - package.json.win10: win10用(package.json にrenameして使用)
        - src/memelib.min.js: SDK本体
        - src/main.js: メインプロセス
        - src/index.html: レンダラープロセス
    - 手順
        1. main.js内のアプリ認証(app_id/app_secret)情報を記載
        1. Win10の場合はElectronのリビルド[Building for electron](https://github.com/jasongin/noble-uwp)
        1. `npx electron src`
