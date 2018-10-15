# JinsMemeSDK-NodeJS

JINS MEME SDK for Node.js using noble BLE library. Works on Windows and Mac! (May be on Linux too).

nobleを利用したNode.js用JINS MEME SDKです。WindowsとMacで(おそらくLinuxでも)動作します!

## 概要

- Node.jsにおいて、JINS MEMEと通信を行うSDKです。
- Electronのmainプロセスにも配置できるよう、インタラクションが必要な部分はイベントハンドラを使用しています。
- 複数台のJINS MEMEとの通信に対応しています(6台の同時通信まで確認済み@Windows10)。

## License

[JINS MEME 利用規約](https://jins-meme.com/ja/terms)に準じます。

## Change Log - 更新履歴

ver. 0.9.6 Initial beta release.

## Prerequisites 必要な外部パッケージ

事前に以下のパッケージを組み込んでください。

- noble
    - MacのBLEライブラリ
    - Windowsでドライバをインストールするとこのライブラリも使用できますが、現在その方式はサポートしていません。
    - MIT License
    - ^1.9.1
- noble-uwp
    - Windows10(Fall creators update以降)のBLEライブラリ
    - MIT License
    - ^0.6.2
    
nobleかnoble-uwpのどちらか片方が必要です。現状は以下のコードで読み込むパッケージを分岐しています。

 ```
if(process.platform === 'win32') {
    noble = require('noble-uwp');
} else {
    noble = require('noble');
}
```

- node-rest-client
    - SDK認証の通信に必要なライブラリ
    - MIT License
    - ^3.1.0

## Sample

- Electronアプリ(2台同時での接続動作を確認できるサンプル)
    - package.json.mac: mac用(package.json にrenameして使用)
    - package.json.win10: win10用(package.json にrenameして使用)
    - src/memelib.min.js: SDK本体
    - src/main.js: メインプロセス
    - src/index.html: レンダラープロセス
- 手順
    1. git clone
    1. main.js内のアプリ認証(app_id/app_secret)情報を記載
    1. Win10の場合はElectronのリビルド[Building for electron](https://github.com/jasongin/noble-uwp)
    1. `npx electron src`
    

## 動作の流れ

以下が最小限の実行シーケンスとなります

- requireによるmemelibの読み込み
- setAppClientID によるアプリ認証を実行
- memeDeviceインスタンスの作成
- scanによるMEMEの検索
- connectによるMEMEへの接続
- startDataReport/stopDataReportによるデータの受信開始/終了
- disconnectによるMEMEとの切断


## メソッド詳細
### setAppClientID

[JINS MEME DEVELOPERS](https://developers.jins.com/)で取得した認証情報を利用しアプリ認証を行ないます。 JINS MEME SDK for NodeJS を利用するには、まずはじめにこのAPIを1度実行する必要があります。無効なコードだった場合は以降のプロセスでJINS MEMEと接続ができません。複数MEMEで使用する場合はどれかのインスタンスで1回実行すればOKです。

`setAppClientID(appClientId, clientSecret, successCallback, errorCallback);`
- appClientId: JINS MEME DEVELOPERS で取得したclient_id
- clientSecret: JINS MEME DEVELOPERS で取得したclient_secret
- successCallback: 認証成功時の処理
- errorCallback: 認証失敗時の処理

### memeDevice

インスタンスの作成を行います。複数インスタンスで利用する場合はmain内の各種処理で振り分けが必要になります。

`let memeDevice = new memeDevice();`

### scan

デバイスのBLE scanを開始し、MEMEの検索を開始します。scanは20秒で自動で止まります。見つかった端末はdevice-discoveredのイベントリスナ経由でdevice情報を通知します。

`memeDevice.scan();`

### connect

接続するMEMEのMACアドレスを指定しRTモードデータに対するコールバック関数をセットし接続します。

`memeDevice.connect(mac_address_without_coron, callback[, mode]);`
- mac_address_without_coron: コロンを含まないMAC Address文字列をセットします
- callback: リアルタイムモード受信時のコールバック関数をセットします
- mode: 接続のオプション設定を行います
    - mode = 0: do nothing on error（default）
    - mode = 1: retry connect once

callbackではdataオブジェクトとして以下のデータが渡されます。
```
data = {
      blinkSpeed: /*瞬目速度*/,
      blinkStrength: /*瞬目強度*/,
      roll: /*角度R*/,
      pitch: /*角度P*/,
      yaw: /*角度Y*/,
      accX: /*加速度X*/,
      accY: /*加速度Y*/,
      accZ: /*加速度Z*/,
      fitError: /*装着フラグ(使用非推奨)*/,
      walking: /*歩行フラグ*/,
      noiseStatus: /*ノイズ状態*/,
      powerLeft: /*電池残量5段階*/,
      eyeMoveUp: /*視線移動上*/,
      eyeMoveDown: /*視線移動下*/,
      eyeMoveLeft: /*視線移動ひだり*/,
      eyeMoveRight: /*視線移動右*/
    };
```

### scanAndConnect

接続するMEMEが決まっている場合にMACアドレスを指定してscanを開始し、該当デバイスが見つかった場合connectを同時に行います。

`memeDevice.scanAndConnect(mac_address_without_coron,  callback);`
- mac_address_without_coron: コロンを含まないMAC Address文字列をセットします
- callback: リアルタイムモード受信時のコールバック関数をセットします

### startDataReport

接続状態にある時、データ送信を開始します。

`memeDevice.startDataReport();`

### stopDataReport

接続状態にある時、データ送信を終了します。

`memeDevice.stopDataReport();`

### disconnect

接続中のMEMEと切断します。

`memeDevice.disconnect();`

## イベントリスナ
### device-discovered

scan中にデバイスが見つかった時に通知するdevice情報のイベントリスナ、連番id、macアドレスなどを通知します。
electronの場合はこれの情報をrendererのダイアログに送ることでmain側にロジックを配置することが可能になります。

```
memeDevice.on('device-discovered', (device) => {
  //デバイス情報を処理する
})
```

deviceは以下のオブジェクト構造をとります。
```
device = {
      idx: /**/,
      peripheral: /*peripheral情報*/,
      mac_addr: /*mac_addr*/,
      name: /*localName*/,
      rssi: /*rssi*/
    };
```

### device-status

接続・切断の状態が変わった時に通知します。

```
memeDevice1.on('device-status', (status) => {
  //
});
```

- status: 0: 切断
- status: 1: 接続


## 実装のヒント
### 接続後にすぐデータ送信を開始する

接続後に自動的にデータ送信を開始したい場合は、device-status == 1を受信時にstartDataReportを実行します。

```
memeDevice.on('device-status', (status) => {
  if(status == 1){
    memeDevice.startDataReport();
  }
});
```
