// Copyright 2018 Taiki Komoda, JINS Inc, all rights reserved

const memeDevice = require('jinsmemesdk-node-noble-uwp'); 
let memeDevice1 = new memeDevice();
memeDevice1.setAppClientID("app_id", "app_secret",
  function(){
    console.log("App authorization succeeded.");
  },
  function(){
    console.log("App authorization failed.")
  }
);

const electron = require('electron');
const {app, BrowserWindow, ipcMain, Menu, Tray} = require('electron');
const robot = require('robotjs');
const path = require('path');
const url = require('url');

const Store = require('electron-store');
const store = new Store();

// メインウィンドウ
let mainWindow;

// マウス関連
let dcnt = 0;
let x_moment = 0;
let y_moment = 0;
let tilt_moment = 0;
let pitch_m1 = 0;
let yaw_m1 = 0;
let screen_size = {x: 1280, y:720};
let blink = {ts_m1: 0, peak_w: 100, time:0};
let settings = {click_th: 80, rclick_th: 200, cursol_speed: 75,
  cursol_on: true, scroll_on: true, auto_connect: true}
let cursol_toggle = 0; 

const createWindow = () => {
  // メインウィンドウを作成します
  mainWindow = new BrowserWindow({width: 350, height: 450});
 
  //Get screen size 
  screen_size.x = electron.screen.width;
  screen_size.y = electron.screen.height;
 
  // レンダラープロセス
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

  // 最小化処理
  mainWindow.on('minimize',function(event){
    event.preventDefault();
    mainWindow.hide();
  });
  
  //メインウィンドウの読み込み完了後の処理
  mainWindow.webContents.on('did-finish-load', function() {
    //設定ファイルの読み込み
    if(typeof(store.get('app_settings')) !== 'undefined'){
      applySettings(store.get('app_settings'));
      sendSettings(store.get('app_settings'));
      if(settings.auto_connect == 1 && typeof(store.get('former_mac_addr')) !== 'undefined'){
        console.log(`Last connected: ${store.get('former_mac_addr')}`);
        memeDevice1.scanAndConnect(store.get('former_mac_addr'));
      }
    }
  });

  //Trayの設定
  const iconPath = path.join(__dirname,'icon.png');
  console.log(iconPath);
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate([
    {label: "Show", click: () => {
      //アイコン化して出すだけ mainWindow.focus();
      mainWindow.show();
    }},
    {label: "Pause", click: () => {
      console.log("paused");
      memeDevice1.stopDataReport();
      mainWindow.webContents.send('device-status', {status:2});
    }},
    {label: "Resume", click: () => {
      memeDevice1.startDataReport(realtimeModeCB_dev1);
      mainWindow.webContents.send('device-status', {status:1});
    }},
    {type: "separator"},
    {role: "quit"}, 
  ]);
  tray.setToolTip('MEME Mouse')
  tray.setContextMenu(contextMenu)
}

//backgroundで不安定になる？？
app.commandLine.appendSwitch('disable-renderer-backgrounding');

//  初期化が完了した時の処理
app.on('ready', createWindow);
 
// 全てのウィンドウが閉じたときの処理
app.on('window-all-closed', () => {
  //切断しないとelectronが終了しない
  memeDevice1.disconnect();
  // macOSのとき以外はアプリケーションを終了させます
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

//display message in renderer from main
const status_log = (msg) => {
  if (mainWindow !== null) {
    mainWindow.webContents.send('status-msg', msg);
  }
}

//設定の受信
ipcMain.on('apply-settings-from-renderer', (event, arg) => {
  applySettings(arg);
})

//設定のシリアライズ文字列を読み込み反映、APP起動時と設定反映時に実行
const applySettings = arg_str => {
  settings = JSON.parse(arg_str);
  store.set('app_settings', arg_str);
}

//設定のシリアライズ文字列を読み込みrendererに反映
const sendSettings = arg_str => {
  mainWindow.webContents.send('apply-settings-from-main', arg_str);
}

//display message in renderer from memedevlib
memeDevice1.on('status-log', (msg) => {
  status_log(msg);
});

//スキャン開始の受信
ipcMain.on('start-stop-scan', (event, arg) => {
  memeDevice1.scan();
})

//見つかったデバイスをメインウィンドウに知らせる
memeDevice1.on('device-discovered', (device) => {
  mainWindow.webContents.send('reply-to-mainwindow', device)
})

//接続の受信とmemeDevへの指示
ipcMain.on('connect-device', (event, arg) => {
  memeDevice1.connect(arg,1);
})

//device-statusの受信とrendererへの転送、0は切断、1はcharacteristic取得
memeDevice1.on('device-status', (arg) => {
  mainWindow.webContents.send('device-status', arg);
  //characteristic取得後後処理
  if(arg.status == 1){
    memeDevice1.startDataReport(realtimeModeCB_dev1); //to RT mode
    store.set('former_mac_addr', arg.mac_addr);
  }
});

//コマンドの受信
ipcMain.on('meme-command', (event, arg) => {
  let memeDevice_ = memeDevice1;
  switch( arg.command ) {
    case 99:
      memeDevice_.disconnect();
      break;
    case 3:
      memeDevice_.setMemeMode();
      break;
    case 4:
      memeDevice_.startDataReport(realtimeModeCB_dev1);
      break;
    case 5:
      memeDevice_.stopDataReport();
      break;
    case 98:
      memeDevice_.status();
      break;  }
})

//リアルタイムモードを処理する部分
const realtimeModeCB_dev1 = data => {
  if(Math.abs(data.yaw - yaw_m1) > 300){
    x_moment = (data.yaw + 360 * Math.sign(yaw_m1 - data.yaw)) - yaw_m1;
  } else {
    x_moment = data.yaw - yaw_m1;
  }
  if(Math.abs(data.pitch - pitch_m1) > 300){
    y_moment = (data.pitch + 360 * Math.sign(pitch_m1 - data.pitch)) - pitch_m1;
  } else {
    y_moment = data.pitch - pitch_m1;
  }

  tilt_moment = data.accX / data.accZ + 0.07;
  dcnt++;
  yaw_m1 = data.yaw;
  pitch_m1 = data.pitch;
  
  if(settings.cursol_on && dcnt > 2){
    if(Math.abs(x_moment) > 0.12 || Math.abs(y_moment) > 0.1){
      var vm_loc = robot.getMousePos();
      vm_loc.x += settings.cursol_speed / 100 * Math.sign(x_moment) * Math.pow(x_moment / 0.18, 2);
      vm_loc.y += settings.cursol_speed / 100 * Math.sign(y_moment) * Math.pow(y_moment / 0.12, 2);
      vm_loc.x = vm_loc.x > screen_size.x ? screen_size.x - 5 : (vm_loc.x < 0 ? 5 : vm_loc.x);
      vm_loc.y = vm_loc.y > screen_size.y ? screen_size.y - 5 : (vm_loc.y < 0 ? 5 : vm_loc.y);
      if(cursol_toggle == 0){
        robot.moveMouse(vm_loc.x, vm_loc.y);
      } else {
        robot.dragMouse(vm_loc.x, vm_loc.y);
      }
    }
  }

  //クリック検出
  let date_now = Date.now();
  if(data.blinkStrength > 40){
    blink.time++;
    status_log(`blink: ${data.blinkSpeed} ${blink.time}`);

    //2回のドラッグを優先
    if (blink.time == 2){
      if(cursol_toggle == 0){
        //近すぎるとダブルクリックと認識されるのでタイムアウト設定
        setTimeout(function(){
          robot.mouseToggle("down")
        },400);
        cursol_toggle = 1;
      } else {
        robot.mouseToggle("up");
        cursol_toggle = 0;
      }
    } else if (data.blinkSpeed >= settings.rclick_th){
      robot.mouseClick(button = "right");
    } else if (data.blinkSpeed >= settings.click_th){
      robot.mouseClick();
    }
    blink.ts_m1 = date_now;
  }
  
  if(date_now - blink.ts_m1 >= 550){
    blink.time = 0;
    cursol_toggle = 0;
  }

  //スクロール処理
  if(settings.scroll_on && Math.abs(tilt_moment) > 0.15){
    robot.scrollMouse(0, Math.sign(tilt_moment) * Math.pow((Math.abs(tilt_moment) - 0.1)/ 0.02, 2));
  }

}