// Copyright 2018, JINS Inc., all rights reserved
// アプリケーション作成用のモジュールを読み込み、インスタンスを作成
const memeDevice = require('jinsmemesdk-node-noble-uwp'); 
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
memeDevice1.setAppClientID("416064993444878", "evtl3ikh3nzml5gcx9odo9vt7vjulpik",
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
    console.log(`dev1: ${cnt} : ${data.accX}`);
  }
}

//スキャンして該当mac_addressが見つかったら接続
memeDevice1.scanAndConnect('28a18305a32c');

//characteristic取得後後処理
memeDevice1.on('device-status', (arg) => {
  if(arg.status == 1){
    //自動的にリアルタイムモードデータを取得する
    memeDevice1.startDataReport(realtimeModeCB_dev1); 
  }
});