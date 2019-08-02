# electron-sample

## 概要

electronで2台のJINS MEMEに接続するサンプルです。mainプロセスでJINS MEMEのハンドリングをします。

## Prerequisites 必要な外部パッケージ

事前に以下のパッケージを組み込んでください。標準ではnoble-winrtがpackage.jsonで設定されています。

- noble派生のいずれかを読み込み
    - noble-winrt(https://github.com/Timeular)
        - Windows(Windows 10 build 10.0.15063 or later)のBLEライブラリ
        - MIT License
        - ^0.0.3
        - npm経由だと異なるものがインストールされるのでgithub経由でインストールしてください
    - noble-mac
        - Mac(macOS 10.7 or later)のBLEライブラリ
        - MIT License
        - ^0.0.4
    - noble
        - Mac(上記より古いバージョンでしか動作しません)/LinuxのBLEライブラリ
        - MIT License
        - ^1.9.1
- jinsmemesdk-node-noble-x
    - JINS MEME SDK 部分です。
    - License: [JINS MEME SDK 利用規約(ja)](https://developers.jins.com/ja/sdks/terms_and_conditions/) [(en)](https://developers.jins.com/en/sdks/terms_and_conditions/)
    - ^0.11.1
- electron
    - License: MIT
    - ^4.2.0 (3.x, 5.x, 6.xでも動作確認済みです)
- electron-store
    - License: MIT
    - ^2.0.0

## Using external script/css 使用している外部スクリプト/css

electronサンプルでは以下のUIライブラリを使用しています。

- onsen-ui
    - モバイルアプリケーションライブラリ
    - License: Apache License 2.0

## Sample使用手順

1. git clone したあと、electron-sample/src/main.js の以下のnoble指定個所を必要に応じて修正してください
    - Windows 10: `module.exports.noble_type = 'noble-winrt';`
    - Mac: `module.exports.noble_type = 'noble-mac';`
    - Linux: `module.exports.noble_type = 'noble';`
1. package.json の dependencies も noble-winrt/noble-mac/noble を必要に応じて修正
1. npm install '**Listed in prerequisites**'
1. main.js内のアプリ認証(app_id/app_secret)情報、接続するMEMEのMACアドレス(mac_addr_to_connect, **コロンなし小文字** )を記載
1. Electronのリビルド [Building for electron](https://github.com/jasongin/noble-uwp)
    ```
    npm rebuild --runtime=electron --target=4.2.4 --arch=x64 --rebuild --disturl=https://atom.io/download/electron --build_from_source=true
    ```
    - Windows-Build-Toolsは必ず **--vs2015** をつけてインストール
    - USB周りのビルドエラーが出るときは usb/libusb/libusb/strerror.c のソースを修正し(ロシア語〜Ruを外す)リビルド
1. `npx electron src`
