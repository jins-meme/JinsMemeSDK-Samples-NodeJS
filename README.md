# JinsMemeSDK-Samples-NodeJS

## 【重要】サポート終了のお知らせ

JINS MEME は　2021年3月末をもちましてサポートを終了しています。SDKにつきましても2021年9月末をもって動作しなくなりますのでご注意ください。

https://jins-meme.com/ja/support/user-support/jins-meme%E3%81%AE%E3%82%B5%E3%83%9D%E3%83%BC%E3%83%88%E7%B5%82%E4%BA%86%E3%81%AB%E3%81%A4%E3%81%84%E3%81%A6/

## 概要

A Node.js application samples for JinsMemeSDK-NodeJS

JinsMemeSDK-NodeJSを利用したNode.jsサンプルです。

## 注意点

JinsMemeSDK-NodeJS v0.10 からnobleの扱い方が変更されています。nobleはSDKのpackage.jsonから読み込みはされないのでアプリ側で記載されるようご注意ください。

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
- ビルドの詳細に関しては[こちらの記事](https://qiita.com/komde/items/d31880c6c11f760425b9)を参考にしてください。
