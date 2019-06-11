// Copyright 2019, 2018, JINS Inc., all rights reserved
// アプリケーション作成用のモジュールを読み込み、インスタンスを作成
module.exports.noble_type = 'noble-uwp';
const memeDevice = require('jinsmemesdk-node-noble-x');
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
memeDevice1.setAppClientID("app_id", "app_secret",
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
  console.log(`dev1: ${cnt} : ${data.accX}`);
}

//スキャンして該当mac_addressが見つかったら接続
memeDevice1.scanAndConnect('mac_addr_to_connect');

//characteristic取得後後処理
memeDevice1.on('device-status', (arg) => {
  if(arg.status == 1){
    //自動的にリアルタイムモードデータを取得する
    memeDevice1.startDataReport(realtimeModeCB_dev1);
  }
});
