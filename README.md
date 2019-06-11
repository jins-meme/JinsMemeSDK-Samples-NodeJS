# JinsMemeSDK-Samples-NodeJS

A Node.js application samples for JinsMemeSDK-NodeJS

JinsMemeSDK-NodeJSを利用したNode.jsサンプルです。

## 注意点

JinsMemeSDK-NodeJS v0.10 からnobleの扱い方が変更されています。nobleはSDKのpackage.jsonではなくアプリ側に記載するようになっていますのでご注意ください。

## 概要

以下の3サンプルを収録しています。

- simple-sample: 最小構成のNodeスクリプトです。指定したMACアドレスにscan&connectをかけにいき、接続後データ取得を開始します。
- electron-sample: electronで2台のJINS MEMEに接続するサンプルです。mainプロセスでJINS MEMEのハンドリングをします。
- jinsmeme-mouse: JINS MEME でマウスを操作するelectronアプリです。

## License

MIT

## 詳細

- それぞれのフォルダのREADME.mdを参照してください。
- electronを使用するelectron-sample, jinsmeme-mouseに関してはビルドがnode/electronのバージョンに大きく影響を受けますので、nvmなどを利用し複数のNodejs環境を整えた上でのビルドをオススメいたします。
- 以下の記事を参考にしてください。
https://qiita.com/komde/items/d31880c6c11f760425b9