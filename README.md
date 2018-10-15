# JinsMemeSDK-Electron

JINS MEME SDK for Electron using noble BLE library. Works on Windows and Mac!
nobleを利用したElectron用JINS MEME SDKです。WindowsとMacで動作します!

## 概要

- Electronにおいて、JINS MEMEと通信を行うSDKです。
- mainプロセスにも配置できるよう、インタラクションが必要な部分はイベントハンドラを使用しています。

## License



## Change Log - 更新履歴

ver. 0.9.6: Initial beta release.

## 

## 必要な外部パッケージ

事前に以下のパッケージを組み込んでください。

- noble
    - MacのBLEライブラリ
    - Windowsでドライバをインストールするとこちらのライブラリも使用できますが、現在その方式はサポートしていません。
    - MIT License
- noble-uwp
    - Windows10(Fall creators update以降)のBLEライブラリ
    - MIT License
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
    
## 動作の流れ

以下が最小限の実行シーケンスとなります
- setAppClientID によるSDK認証を実行
- memeDeviceインスタンスの作成
- scanによるMEMEの検索
- connectによるMEMEへの接続
- startDataReport/stopDataReportによるデータの受信開始/終了
- disconnectによるMEMEとの切断


## メソッド詳細
### setAppClientID

アプリ認証、SDK認証を行ないます。 JINS MEME SDK for Electron を利用するには、まずはじめにこのAPIを1度実行する必要があります。無効なコードだった場合は以降のプロセスでライブラリが使用できなくなります。複数MEMEで使用する場合でも1回でOKです。

#### 構文

setAppClientID(appClientId, clientSecret, successCallback, errorCallback);


### memeDevice

インスタンスの作成を行います。
複数インスタンスで利用する場合はmain内の各種処理で振り分けが必要になります。

#### 構文

let memeDevice = new memeDevice();


### scan

デバイスのBLE scanを開始し、MEMEの検索を開始します。scanは20秒で自動で止まります。見つかった端末はdevice-discoveredのイベントリスナ経由で

#### 構文

memeDevice.scan();

### connect

接続するMEMEのMACアドレスを指定しRTモードデータに対するコールバック関数をセットし接続します。

#### 構文

memeDevice.connect('mac_address_without_coron', callback[, mode]);

mode = 0: do nothing on error（default）
mode = 1: retry connect once

### scanAndConnect

接続するMEMEが決まっている場合にMACアドレスを指定してscanを開始し、該当デバイスが見つかった場合connectを同時に行います。

#### 構文

memeDevice.scanAndConnect('mac_address_without_coron',  callback);


### startDataReport

接続状態にある時、データ送信を開始します。

#### 構文

memeDevice.startDataReport();


### stopDataReport

接続状態にある時、データ送信を終了します。

#### 構文

memeDevice.stopDataReport();


### disconnect

接続中のMEMEと切断します。

#### 構文

memeDevice.disconnect();



## イベントリスナ
### device-discovered

scan時にデバイスが見つかった時に、device情報のイベントリスナ、連番id、macアドレスなどを通知します。
electronの場合はこれの情報をrendererのダイアログに送ることでmain側にロジックを配置することが可能になります。

memeDevice.on('device-discovered', (device) => {
  //デバイス情報を処理する
})

### device-status

接続・切断の状態が変わった時に通知します。
0: 切断
1: 接続
memeDevice1.on('device-status', (arg) => {
  //
});

## 実装のヒント
### 接続後にすぐデータ送信を開始する

接続後に自動的にデータ送信を開始したい場合は、device-status
memeDevice1.on('device-status', (status) => {
  if(status == 1){
    memeDevice.startDataReport();
  }
});

