// Copyright 2018 Taiki Komoda, JINS Inc, all rights reserved
// アプリケーション作成用のモジュールを読み込み

//20180831 ver.0.9.0 Taiki Komoda 一通りやるべきことはやった気がする
//20180905 ver.0.9.3 Taiki Komoda scanタイマーの設定、bt_addrの設定方法変更
//20181001 ver.0.9.5 Taiki Komoda コマンド部分のWebAssembly化
//20181015 ver.0.9.6 Taiki Komoda App認証の追加と、デバイス選択を連番IDではなくMAC Addrで実施に変更。
//20181016 ver.0.9.7 Taiki Komoda 接続完了時にscan停止
//20181017 ver.0.9.8 Taiki Komoda HW ver取得のコードをWASM,JSに追加

const EventEmitter = require('events').EventEmitter;
const util = require('util');

//MEME Command の Wasm の Array を配列から読み込む
//wasm ver. 20181017
const wasm_buff = new Uint8Array([0,97,115,109,1,0,0,0,1,25,5,96,0,1,127,96,2,127,127,1,125,96,2,127,127,1,127,96,1,127,1,127,96,0,0,3,24,23,0,2,1,1,1,1,1,1,3,2,2,2,3,3,3,3,3,3,3,3,2,2,4,4,5,1,112,1,1,1,5,3,1,0,1,6,36,7,127,0,65,40,11,127,1,65,0,11,127,0,65,3,11,127,0,65,8,11,127,0,65,7,11,127,0,65,8,11,127,0,65,48,11,7,174,2,22,6,109,101,109,111,114,121,2,0,5,97,100,100,101,114,0,0,7,114,116,95,97,99,99,88,0,2,7,114,116,95,97,99,99,89,0,3,7,114,116,95,97,99,99,90,0,4,7,114,116,95,114,111,108,108,0,5,8,114,116,95,112,105,116,99,104,0,6,6,114,116,95,121,97,119,0,7,13,114,116,95,98,108,105,110,107,83,112,101,101,100,0,8,16,114,116,95,98,108,105,110,107,83,116,114,101,110,103,116,104,0,9,12,100,101,118,73,110,102,111,77,111,100,101,108,0,10,15,100,101,118,73,110,102,111,77,111,100,101,108,83,117,98,0,11,11,114,116,95,102,105,116,69,114,114,111,114,0,12,10,114,116,95,119,97,108,107,105,110,103,0,13,14,114,116,95,110,111,105,115,101,83,116,97,116,117,115,0,14,12,114,116,95,112,111,119,101,114,76,101,102,116,0,15,12,114,116,95,101,121,101,77,111,118,101,85,112,0,16,14,114,116,95,101,121,101,77,111,118,101,68,111,119,110,0,17,14,114,116,95,101,121,101,77,111,118,101,76,101,102,116,0,18,15,114,116,95,101,121,101,77,111,118,101,82,105,103,104,116,0,19,13,100,101,99,114,121,112,116,83,105,110,103,108,101,0,20,11,99,114,121,112,116,83,105,110,103,108,101,0,21,9,7,1,0,65,0,11,1,22,10,189,9,23,15,0,35,1,65,1,106,65,255,1,113,36,1,35,1,11,38,1,1,127,32,0,40,2,0,33,2,32,1,32,2,40,2,0,65,0,118,73,4,127,32,2,32,1,65,0,116,106,45,0,8,5,0,11,11,104,2,3,127,1,125,32,0,65,12,107,35,0,65,12,16,1,65,255,1,113,115,65,255,1,113,33,2,32,1,65,15,107,35,0,65,15,16,1,65,255,1,113,115,65,255,1,113,33,3,32,2,65,16,108,32,3,65,15,113,106,33,4,32,4,65,128,16,113,65,0,75,4,125,32,4,179,67,0,0,128,69,147,67,0,0,128,65,149,5,32,4,179,67,0,0,128,65,149,11,33,5,32,5,11,104,2,3,127,1,125,32,0,65,13,107,35,0,65,13,16,1,65,255,1,113,115,65,255,1,113,33,2,32,1,65,15,107,35,0,65,15,16,1,65,255,1,113,115,65,255,1,113,33,3,32,2,65,16,108,32,3,65,4,118,106,33,4,32,4,65,128,16,113,65,0,75,4,125,32,4,179,67,0,0,128,69,147,67,0,0,128,65,149,5,32,4,179,67,0,0,128,65,149,11,33,5,32,5,11,104,2,3,127,1,125,32,0,65,14,107,35,0,65,14,16,1,65,255,1,113,115,65,255,1,113,33,2,32,1,65,16,107,35,0,65,16,16,1,65,255,1,113,115,65,255,1,113,33,3,32,2,65,16,108,32,3,65,15,113,106,33,4,32,4,65,128,16,113,65,0,75,4,125,32,4,179,67,0,0,128,69,147,67,0,0,128,65,149,5,32,4,179,67,0,0,128,65,149,11,33,5,32,5,11,103,2,3,127,1,125,32,0,65,6,107,35,0,65,6,16,1,65,255,1,113,115,65,255,1,113,33,2,32,1,65,7,107,35,0,65,7,16,1,65,255,1,113,115,65,255,1,113,33,3,32,3,65,128,2,108,32,2,106,33,4,32,4,65,128,128,2,113,65,0,75,4,125,32,4,179,67,0,0,128,71,147,67,0,0,200,66,149,5,32,4,179,67,0,0,200,66,149,11,33,5,32,5,11,103,2,3,127,1,125,32,0,65,8,107,35,0,65,8,16,1,65,255,1,113,115,65,255,1,113,33,2,32,1,65,9,107,35,0,65,9,16,1,65,255,1,113,115,65,255,1,113,33,3,32,3,65,128,2,108,32,2,106,33,4,32,4,65,128,128,2,113,65,0,75,4,125,32,4,179,67,0,0,128,71,147,67,0,0,200,66,149,5,32,4,179,67,0,0,200,66,149,11,33,5,32,5,11,74,2,3,127,1,125,32,0,65,10,107,35,0,65,10,16,1,65,255,1,113,115,65,255,1,113,33,2,32,1,65,11,107,35,0,65,11,16,1,65,255,1,113,115,65,255,1,113,33,3,32,3,65,128,2,108,32,2,106,33,4,32,4,179,67,0,0,200,66,149,33,5,32,5,11,36,1,1,127,32,0,65,3,107,35,0,65,3,16,1,65,255,1,113,115,65,255,1,113,65,10,108,33,1,32,1,65,255,255,3,113,11,66,1,3,127,32,0,65,4,107,35,0,65,4,16,1,65,255,1,113,115,65,255,1,113,33,2,32,1,65,5,107,35,0,65,5,16,1,65,255,1,113,115,65,255,1,113,33,3,32,3,65,128,2,108,32,2,106,33,4,32,4,65,255,255,3,113,11,72,1,4,127,32,0,65,0,107,35,0,65,0,16,1,65,255,1,113,115,65,255,1,113,33,2,32,1,65,1,107,35,0,65,1,16,1,65,255,1,113,115,65,255,1,113,33,3,32,3,65,128,2,108,32,2,106,33,4,32,4,65,192,31,113,65,6,118,33,5,32,5,11,68,1,4,127,32,0,65,0,107,35,0,65,0,16,1,65,255,1,113,115,65,255,1,113,33,2,32,1,65,1,107,35,0,65,1,16,1,65,255,1,113,115,65,255,1,113,33,3,32,3,65,128,2,108,32,2,106,33,4,32,4,65,63,113,33,5,32,5,11,27,1,1,127,32,0,65,0,107,35,0,65,0,16,1,115,65,255,1,113,65,3,113,33,1,32,1,11,30,1,1,127,32,0,65,0,107,35,0,65,0,16,1,115,65,255,1,113,65,2,118,65,1,113,33,1,32,1,11,30,1,1,127,32,0,65,0,107,35,0,65,0,16,1,115,65,255,1,113,65,3,118,65,1,113,33,1,32,1,11,27,1,1,127,32,0,65,0,107,35,0,65,0,16,1,115,65,255,1,113,65,4,118,33,1,32,1,11,27,1,1,127,32,0,65,2,107,35,0,65,2,16,1,115,65,255,1,113,65,3,113,33,1,32,1,11,30,1,1,127,32,0,65,2,107,35,0,65,2,16,1,115,65,255,1,113,65,2,118,65,3,113,33,1,32,1,11,30,1,1,127,32,0,65,2,107,35,0,65,2,16,1,115,65,255,1,113,65,4,118,65,3,113,33,1,32,1,11,27,1,1,127,32,0,65,2,107,35,0,65,2,16,1,115,65,255,1,113,65,6,118,33,1,32,1,11,34,1,1,127,32,0,32,1,65,2,107,107,35,0,32,1,65,2,107,65,255,1,113,16,1,115,65,255,1,113,33,2,32,2,11,38,1,1,127,32,0,65,255,1,113,35,0,32,1,65,2,107,65,255,1,113,16,1,115,32,1,106,65,2,107,65,255,1,113,33,2,32,2,11,2,0,11,11,51,2,0,65,8,11,32,18,0,0,0,0,0,0,0,157,126,61,104,123,103,149,248,128,102,187,169,84,55,210,120,246,154,0,0,0,0,0,0,0,65,40,11,8,8,0,0,0,18,0,0,0,0,226,3,4,110,97,109,101,1,218,3,23,0,13,109,101,109,101,99,111,109,47,97,100,100,101,114,1,26,126,108,105,98,47,97,114,114,97,121,47,65,114,114,97,121,60,117,56,62,35,95,95,103,101,116,2,15,109,101,109,101,99,111,109,47,114,116,95,97,99,99,88,3,15,109,101,109,101,99,111,109,47,114,116,95,97,99,99,89,4,15,109,101,109,101,99,111,109,47,114,116,95,97,99,99,90,5,15,109,101,109,101,99,111,109,47,114,116,95,114,111,108,108,6,16,109,101,109,101,99,111,109,47,114,116,95,112,105,116,99,104,7,14,109,101,109,101,99,111,109,47,114,116,95,121,97,119,8,21,109,101,109,101,99,111,109,47,114,116,95,98,108,105,110,107,83,112,101,101,100,9,24,109,101,109,101,99,111,109,47,114,116,95,98,108,105,110,107,83,116,114,101,110,103,116,104,10,20,109,101,109,101,99,111,109,47,100,101,118,73,110,102,111,77,111,100,101,108,11,23,109,101,109,101,99,111,109,47,100,101,118,73,110,102,111,77,111,100,101,108,83,117,98,12,19,109,101,109,101,99,111,109,47,114,116,95,102,105,116,69,114,114,111,114,13,18,109,101,109,101,99,111,109,47,114,116,95,119,97,108,107,105,110,103,14,22,109,101,109,101,99,111,109,47,114,116,95,110,111,105,115,101,83,116,97,116,117,115,15,20,109,101,109,101,99,111,109,47,114,116,95,112,111,119,101,114,76,101,102,116,16,20,109,101,109,101,99,111,109,47,114,116,95,101,121,101,77,111,118,101,85,112,17,22,109,101,109,101,99,111,109,47,114,116,95,101,121,101,77,111,118,101,68,111,119,110,18,22,109,101,109,101,99,111,109,47,114,116,95,101,121,101,77,111,118,101,76,101,102,116,19,23,109,101,109,101,99,111,109,47,114,116,95,101,121,101,77,111,118,101,82,105,103,104,116,20,21,109,101,109,101,99,111,109,47,100,101,99,114,121,112,116,83,105,110,103,108,101,21,19,109,101,109,101,99,111,109,47,99,114,121,112,116,83,105,110,103,108,101,22,4,110,117,108,108]);

let memecom;
WebAssembly.instantiate(wasm_buff).then(result =>
  memecom = result.instance.exports
);

//app認証
const auth_addr = [104, 117, 118, 115, 119, 63, 41, 40, 101, 108, 103, 110, 33, 108, 126, 102, 62, 123, 123, 125, 103, 59, 117, 120, 117, 54, 108, 42, 51, 114, 127, 106, 84, 73, 13, 87, 75, 78, 67, 73];
let is_auth = 0; //認証済みフラグ
//スコープが深いので、、
let setAppClientIDSuccessCallback;
let setAppClientIDErrorCallback;
const Client = require('node-rest-client').Client; 
let client = new Client();

const memeDevice = function(){ //ここはアロー関数使っちゃダメらしい
  let self = this; //setTimeoutはthisが変わる
  const serviceUUIDs = ['d6f25bd15b54436096d87aa62e04c7ef'];//no hyphen
  const MEME_CHARACTERISTIC_UUIDs = ['d6f25bd25b54436096d87aa62e04c7ef','d6f25bd45b54436096d87aa62e04c7ef'];
  let meme_rw_characteristics;
  let meme_nr_characteristics;
  let peripheral_connected;
  let connection_retry;
  let scanTimer;
  let connectTimer;
  let noble;
  //console.log(process.platform);
  if(process.platform === 'win32') {
    noble = require('noble-uwp');
  } else {
    noble = require('noble');
  }

  let bt_addr = null; //機器指定再接続用
  let rtCallback_scanAndConnect; //scanAndConnectからのみセット

  let hw_info;
  let fw_info;
  
  //nobleのwarningを拾う
  noble.on('warning', (message) => console.log("warn_noble: " + message));

  //BLE スキャン開始
  let knownDevices = [];
  let knownDevicesObj = {};
  let deviceIdx;

  this.setAppClientID = (client_id, client_secret, successCallback, errorCallback) => {
    //呼ばれないと動かない
    is_auth = 1;
    setAppClientIDSuccessCallback = successCallback;
    setAppClientIDErrorCallback = errorCallback;
    let args = {
      headers: { "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded", "Accept-Language": "ja" },
      parameters: { grant_type: "client_credentials", client_id: client_id, client_secret: client_secret}//,data: "<xml><arg1>hello</arg1><arg2>world</arg2></xml>"
    };
    client.post(decstr(auth_addr), args, function (data, response) {
      //console.log(response.statusCode);
      if(response.statusCode == 401 || response.statusCode == 404){
        //エラー時のみセット
        is_auth = 0;
        setAppClientIDErrorCallback();
      } else {
        setAppClientIDSuccessCallback();
      }
      //console.log(data.access_token);
    });
  }

  const scanStart = () => {
    this.statusLog('Scan start');
    connection_retry = 0;
    deviceIdx = 0;
    knownDevices = [];
    if(peripheral_connected){
      this.disconnect();
    }
    peripheral_connected = null; //再接続とかあるのでここに記載
    noble.stopScanning(); //キャンセルした時のため
    noble.startScanning(serviceUUIDs);
    scanTimer = setTimeout( () => {
      console.log(`Stop scanning by time out.`);
      noble.stopScanning(); //キャンセルした時のため
    },20000);
  }

  this.scan = (arg = null) => {
    //console.log(`noble.state ${noble.state}`);
    bt_addr = arg; //この変数がセットされていると、スキャン時に見つかった瞬間つなぎに行く
    if(noble.state === 'poweredOn'){
      scanStart();
    }else{
      noble.on('stateChange', scanStart);
    }
  }
  /*scanStartうまくひろわない--#
  noble.on('scanStart', function(){
    console.log("Started")
    deviceIdx = 0;
    knownDevices = [];
  });*/
  
  //discovered BLE device
  const discovered = (peripheral) => {
    const device = {
      idx: deviceIdx++,
      peripheral: peripheral,
      mac_addr: peripheral.uuid,
      name: peripheral.advertisement.localName,
      rssi: peripheral.rssi
    };
    knownDevices.push(device);
    knownDevicesObj[peripheral.uuid] = device;
    if (!bt_addr){
      this.discoveredEvent(device); //クラス継承する必要があるので関数自体は後で追加
    } else { //つなぐものが決まっている場合
      if(device.mac_addr == bt_addr){
        //console.log(`matched: ${device.idx}`);
        this.connect(device.mac_addr, rtCallback_scanAndConnect,1);
      }
    }
  }

  //スキャン発見時のイベント設定、スキャン時のみ有効にしないと複数インスタンスに
  //わたってしまうのでスキャン時のみにしようと思ったが、removeListenerが機能しないので恒久リスナに
  noble.on('discover', discovered);

  //接続 
  this.connect = (arg, callback, mode = 0) => {
    if(is_auth === 0){
      console.log("Application not authorized. Set correct app_id and secret.");
    } else {
      connection_retry++;
      //Stop Scan
      noble.stopScanning();
      //これ効かない--##
      //noble.removeListener('discover', function(){console.log("removeListener")});
      
      let peripheral = knownDevicesObj[arg].peripheral;
      peripheral.connect(error => {
        console.log(`retry: ${mode} ${connection_retry}`);
        //Retryフロー
        if(mode == 1){
          connectTimer = setTimeout( () => {
            if(!meme_nr_characteristics){ //Timer側で消しているので大丈夫な気もする
              console.log(`Reconnecting`);
              self.connect(arg, callback, 0); //setTimeoutはthisが変わる
            }
          },10000);
        }
        peripheral.discoverSomeServicesAndCharacteristics(serviceUUIDs, MEME_CHARACTERISTIC_UUIDs, (error, services, characteristics) => {
          meme_rw_characteristics = characteristics[0];
          meme_nr_characteristics = characteristics[1];
          meme_nr_characteristics.on('data', (data, isNotification) => {
            handleNotifications(data,callback,setDevInfo);
          });
          meme_nr_characteristics.subscribe(error => {
            clearTimeout(connectTimer); //消しとかないとRetryがかかっちゃう
            clearTimeout(scanTimer); //消しとかないとRetryがかかっちゃう
            noble.stopScanning();
            //ここが確実に接続完了した証とする
            //あまり良い作りではない気もするが、デバイス情報をここで取得してしまうことにした
            this.getMemeDevInfo();
            this.setMemeMode();
            //動きが不安定ならタイムアウトをつける
            //setTimeout(self.getMemeDevInfo(), 100);
            //setTimeout(self.setMemeMode(), 500);
            this.statusLog('Notification on');
            this.deviceStatus({status:1,mac_addr:peripheral.uuid});
            connection_retry = 0;
            bt_addr = null; //確実に成功した後に消す
            rtCallback = null;
            peripheral_connected = peripheral;
          });
        });

        //切断時に接続情報を無効にするリスナ,
        peripheral.once('disconnect', () => {
          console.log("May be disconnected.");
          meme_rw_characteristics = null;
          meme_nr_characteristics = null;
          this.deviceStatus({status:0});
        });
        
        //調査、あまり意味ないポイ
        peripheral.once('connect', () => {
          console.log("May be connecting.");
        });
      });
      
    }
  }

  this.scanAndConnect = (arg,callback) => {
    rtCallback_scanAndConnect = callback;
    //console.log(rtCallback);
    this.scan(arg);
  }
  //ここはなんかcallbackがうまく設定できない、理由不明。元気があったら直す、、
  this.disconnect = () => {
    if(!(peripheral_connected === null || typeof peripheral_connected === 'undefined')){
      peripheral_connected.disconnect(error => {
        this.statusLog(`Disconnected to peripheral`);
      });
    }
  }
  
  this.getMemeMode = () => {
    if(meme_rw_characteristics){
      meme_rw_characteristics.write(cryptCommand(fromHexString('142300')), true, error => {
        this.statusLog('getMemeMode');
      });  
    }
  }
  this.getMemeDevInfo = () => {
    if(meme_rw_characteristics){
      meme_rw_characteristics.write(cryptCommand(fromHexString('142100')), true, error => {
        this.statusLog('getMemeDevInfo');
      });  
    }
  }
  this.setMemeMode = () => {
    if(meme_rw_characteristics){
      meme_rw_characteristics.write(cryptCommand(fromHexString('142407')), true, error => {
        this.statusLog('setMemeMode');
      });  
    }
  }
  this.startDataReport = () => {
    if(meme_rw_characteristics){
      meme_rw_characteristics.write(cryptCommand(fromHexString('142001')), true, error => {
        this.statusLog('startDataReport');
      });
    }
  }
  this.setMemeModeAndStartDataReport = () => {
    if(meme_rw_characteristics){
      meme_rw_characteristics.write(cryptCommand(fromHexString('142407')), true, error => {
        meme_rw_characteristics.write(cryptCommand(fromHexString('142001')), true, error => {
          this.statusLog('setMemeModeAndStartDataReport');
        });  
      });  
    }
  }
  this.stopDataReport = () => {
    if(meme_rw_characteristics){
      meme_rw_characteristics.write(cryptCommand(fromHexString('142000')), true, error => {
        this.statusLog('stopDataReport');
      });
    }
  }
  this.status = () => {
    this.statusLog(meme_nr_characteristics);
  }

  //以下は取得済みのHW/FWデータを吐き出す
  this.getHWVersion = () => {
    return hw_info;
    //console.log(JSON.stringify(hw_info)); 
  }
  this.getFWVersion = () => {
    return fw_info;
    //console.log(JSON.stringify(fw_info)); 
  }

  //handleNotification内から呼び出され、接続中モジュールスコープの変数に情報をセットする関数
  const setDevInfo = (devinfo) => {
    hw_info = devinfo.hw_info;
    fw_info = devinfo.fw_info;
  }

};

// memeDevice はEventEmitterを継承し、以下のイベントをfire
util.inherits(memeDevice, EventEmitter); 
memeDevice.prototype.discoveredEvent = function(device){  //ここはアロー関数使っちゃダメらしい
  this.emit("device-discovered", device);
}
memeDevice.prototype.statusLog = function(msg){  //ここはアロー関数使っちゃダメらしい
  this.emit("status-log", msg);
}
memeDevice.prototype.deviceStatus = function(msg){  //ここはアロー関数使っちゃダメらしい
  this.emit("device-status", msg);
}

//モジュールとして公開
module.exports = memeDevice;

/* 非公開関数 */
//hex <-> Uint8Array conversion
const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
const toHexString = bytes =>
  bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
//sum Array
const sumArray = arr => {
    return arr.reduce(function(prev, current, i, arr) {
        return prev+current;
    });
};
//index 2~19を暗号化するコマンド、Arrayが突っ込まれてくる
const cryptCommand = plain_array => {
  let crypted = new Uint8Array(20);
  //固定文字列
  crypted[0] = plain_array[0];
  crypted[1] = plain_array[1];
  for (let i = 2 ; i < 19 ; i++){
    crypted[i] = memecom.cryptSingle(plain_array[i], i);
  }
  //checksum(index:17)のセット
  let data_ary = plain_array.slice(2);//データ部分(2以降)を切り出し
  crypted[19] = memecom.cryptSingle(sumArray(data_ary), 19);
  return Buffer.from(crypted.buffer, 0, 20);
}

//aryを文字列に複号
const decstr = ary => {
  let res = '';
  for(var i = 0, length = ary.length; i < length; i++) {
    res += String.fromCharCode(ary[i] ^ i);
  }
  return res;
}

//notification data を振り分ける
const handleNotifications = (raw_data,callback,setDevInfo) => {
  let notf_data = new Uint8Array(20);
  for (let i = 0; i < 20; i++) {
    notf_data[i] = raw_data[i];
  }
  //debug
  //console.log(memecom.rt_blinkSpeed(value[5]));

  //in case rt-mode data
  if(notf_data[0] == 20 && (notf_data[1] == 24)){
    let data = {
      blinkSpeed: memecom.rt_blinkSpeed(notf_data[5]),
      blinkStrength: memecom.rt_blinkStrength(notf_data[6],notf_data[7]),
      roll: memecom.rt_roll(notf_data[8],notf_data[9]),
      pitch: memecom.rt_pitch(notf_data[10],notf_data[11]),
      yaw: memecom.rt_yaw(notf_data[12],notf_data[13]),
      accX: memecom.rt_accX(notf_data[14],notf_data[17]),
      accY: memecom.rt_accY(notf_data[15],notf_data[17]),
      accZ: memecom.rt_accZ(notf_data[16],notf_data[18]),
      fitError: memecom.rt_fitError(notf_data[2]),
      walking: memecom.rt_walking(notf_data[2]),
      noiseStatus: memecom.rt_noiseStatus(notf_data[2]),
      powerLeft: memecom.rt_powerLeft(notf_data[2]),
      eyeMoveUp: memecom.rt_eyeMoveUp(notf_data[4]),
      eyeMoveDown: memecom.rt_eyeMoveDown(notf_data[4]),
      eyeMoveLeft: memecom.rt_eyeMoveLeft(notf_data[4]),
      eyeMoveRight: memecom.rt_eyeMoveRight(notf_data[4])
    };
    //callback
    callback(data);
  
  //DEVINFO 
  } else if(notf_data[0] == 20 && notf_data[1] == 1){
    let hw_info = {model_main: memecom.devInfoModel(notf_data[2], notf_data[3]),
      model_sub: memecom.devInfoModelSub(notf_data[2], notf_data[3]),
      version: memecom.decryptSingle(notf_data[7], 7)
    };
    
    let fw_major = memecom.decryptSingle(notf_data[6], 6);
    let fw_minor = memecom.decryptSingle(notf_data[5], 5);
    let fw_revision = memecom.decryptSingle(notf_data[4], 4);
    let fw_info = {str: `${fw_major}.${fw_minor}.${fw_revision}`, major: fw_major, minor: fw_minor, revision: fw_revision};
    let devinfo = {hw_info: hw_info, fw_info: fw_info};

    //コールバックでインスタンスにセット
    setDevInfo(devinfo);

  } else {
    console.log(toHexString(notf_data));
  }
}



