// Copyright 2018, JINS Corp, all rights reserved
// アプリケーション作成用のモジュールを読み込み、インスタンスを作成
const memeDevice = require('./src/memelib.min.js'); 
let memeDevice1 = new memeDevice();

//データ件数確認用カウンター
const createCounter = () => {
  let cnt = 0;
  return function () {
      return cnt++;
  };
};
const counter1 = createCounter();

//アプリケーションを認証する
memeDevice1.setAppClientID("set_app_id_here", "set_app_secret_here",

  function(){
    console.log("App authorization succeeded.");
  },
  function(){
    console.log("App authorization failed.")
  }
);

//リアルタイムモードを処理するコールバック、デバイスごとに分ける必要あり
const realtimeModeCB_dev1 = data => {
  let cnt = counter1();
  //1秒に2回データをコンソールに吐く
  if(cnt % 10 == 0){
    console.log(`dev1: ${cnt} : ${data.accZ}`);
  }
}

//スキャンして該当mac_addressが見つかったら接続
memeDevice1.scanAndConnect('mac_addr_to_connect',realtimeModeCB_dev1);

//characteristic取得後後処理
memeDevice1.on('device-status', (arg) => {
  if(arg.status == 1){
    //自動的にリアルタイムモードデータを取得する
    memeDevice1.startDataReport(); 
  }
});

