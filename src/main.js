// Copyright 2018, JINS Corp, all rights reserved
// アプリケーション作成用のモジュールを読み込み、インスタンスを作成
const memeDevice = require('./memelib.min.js'); 
let memeDevice1 = new memeDevice();
let memeDevice2 = new memeDevice();
//アプリケーションを認証する
memeDevice1.setAppClientID("app_id", "app_secret",
  function(){
    console.log("App authorization succeeded.");
  },
  function(){
    console.log("App authorization failed.")
  }
);

const electron = require('electron');
const {app, BrowserWindow, ipcMain} = require('electron');
let device_to_connect;

// メインウィンドウ
let mainWindow;
const path = require('path');
const url = require('url');

//カウンター
const createCounter = () => {
  let cnt = 0;
  return function () {
      return cnt++;
  };
};

const counter1 = createCounter();
const counter2 = createCounter();

//nodeの捕捉されなかったPromise内の例外をスタックトレースで表示
process.on('unhandledRejection', console.dir);

const createWindow = () => {
  // メインウィンドウを作成します
  mainWindow = new BrowserWindow({width: 600, height: 800});
 
  // メインウィンドウに表示するURLを指定
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
 
  // デベロッパーツールの起動
  //mainWindow.webContents.openDevTools();

  // メインウィンドウが閉じられたときの処理
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

}

//  初期化が完了した時の処理
app.on('ready', createWindow);
 
// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', () => {
  //切断しないとelectronが終了しないので、明示的に切断
  memeDevice1.disconnect();
  memeDevice2.disconnect();
  // macOSのとき以外はアプリケーションを終了
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// アプリケーションがアクティブになった時の処理(Macだと、Dockがクリックされた時）
app.on('activate', () => {
  // メインウィンドウが消えている場合は再度メインウィンドウを作成する
  if (mainWindow === null) {
    createWindow();
  }
});

//display message in renderer
memeDevice1.on('status-log', (msg) => {
  mainWindow.webContents.send('status-msg', ('memeDevice1: ' + msg));
});
memeDevice2.on('status-log', (msg) => {
  mainWindow.webContents.send('status-msg', ('memeDevice2: ' + msg));
});

//スキャン開始の受信
ipcMain.on('start-stop-scan', (event, arg) => {
  if(arg == 1){
    memeDevice1.scan();
  }
  if(arg == 2){
    memeDevice2.scan();
  }
  //どのインスタンスへの接続ダイアログの記録、connectまで保持
  device_to_connect = arg;    
})

//スキャン＆接続（自動再接続用）
ipcMain.on('scan-and-connect', (event, arg) => {
  if(arg == 1){
    memeDevice1.scanAndConnect('28a183055fac',realtimeModeCB_dev1);
  }
  if(arg == 2){
    memeDevice2.scanAndConnect('28a183055fac',realtimeModeCB_dev2);
  }
})

//見つかったデバイスをメインウィンドウに知らせる
//全てのインスタンスがlistenしているがidついているのは送り主のみなのでそれをとる
memeDevice1.on('device-discovered', (device) => {
  if(device_to_connect == 1){
    mainWindow.webContents.send('reply-to-mainwindow', device)
  }
})
memeDevice2.on('device-discovered', (device) => {
  if(device_to_connect == 2){
    mainWindow.webContents.send('reply-to-mainwindow', device)
  }
})

//接続の受信と指示
ipcMain.on('connect-device', (event, arg) => {
  if(device_to_connect == 1){
    memeDevice1.connect(arg,realtimeModeCB_dev1,1);
  }
  if(device_to_connect == 2){
    memeDevice2.connect(arg,realtimeModeCB_dev2,1);
  }
  device_to_connect = null;
})

//characteristic取得後後処理
memeDevice1.on('device-status', (arg) => {
  if(arg.status == 1){
  }
});
memeDevice2.on('device-status', (arg) => {
  if(arg.status == 1){
    //自動的にリアルタイムモードデータを取得する
    memeDevice2.startDataReport(); 
  }
});

//コマンドの受信
ipcMain.on('meme-command', (event, arg) => {
  let memeDevice_;
  if (arg.device == 1){
    memeDevice_ = memeDevice1;
  }
  if (arg.device == 2){
    memeDevice_ = memeDevice2;
  }
  switch( arg.command ) {
    case 99:
      memeDevice_.disconnect();
      break;
    case 3:
      memeDevice_.setMemeMode();
      break;
    case 4:
      memeDevice_.startDataReport();
      break;
    case 5:
      memeDevice_.stopDataReport();
      break;
    case 8:
      memeDevice_.getMemeMode();
      break;
    case 9:
      memeDevice_.getMemeDevInfo();
      break;
    case 10:
      console.log(memeDevice_.getHWVersion());
      break;
    case 11:
      console.log(memeDevice_.getFWVersion());
      break;
    case 98:
      memeDevice_.status();
      break;  }
})

//リアルタイムモードを処理するコールバック、デバイスごとに分ける必要あり
const realtimeModeCB_dev1 = data => {
  let cnt = counter1();
  //1秒に1回データをコンソールに吐く
  if(cnt % 20 == 0){
    console.log(`dev1: ${cnt} : ${data.accZ}`);
  }
}
const realtimeModeCB_dev2 = data => {
  let cnt = counter2();
  if(cnt % 20 == 0){
      console.log(`dev2: ${cnt} : ${data.accZ}`);
  }
}
