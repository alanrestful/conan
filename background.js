//初始化
init_localStorage();

// 为extension的点击监听
chrome.browserAction.onClicked.addListener(function(tab) {
  var manager_url = chrome.extension.getURL("manager.html");
  focusOrCreateTab(manager_url);
});

/**
 * content数据本地化
 */
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    var testers = __storage_to_obj(localStorage.tester_arrays);
    var req_obj = typeof(request.data) == "object" ? request.data : __storage_to_obj(request.data);

    var obj = __tester_array(testers, sender.tab.url);
    if(obj == null){
      testers.push(new TesterArray(sender.tab.url, req_obj));
    }else{
      obj.tArray.push(req_obj);
    }

    console.log(testers);
    localStorage.tester_arrays = __obj_to_storage(testers);
});

//初始化localstorage数据
function init_localStorage() {
  // 测试同步服务端
  if(localStorage.testerServer == null){
    localStorage.testerServer = "http://localhost:9024";
  }

  // log日志级别
  if(localStorage.logLevel == null){
    localStorage.logLevel = "log";
  }

  // 默认是否同步数据
  if(localStorage.syncTester == null){
    localStorage.syncTester = "true";
  }

  // 测试本地数据
  if(localStorage.tester_arrays == null){
    localStorage.tester_arrays = JSON.stringify([]);
  }

  // 待同步远端的数据
  if(localStorage.needSyncTester == null){
      localStorage.needSyncTester = JSON.stringify([]);
  }

  // 测试结果本地数据
  if(localStorage.log_result == null){
    localStorage.log_result = JSON.stringify([]);
  }
}

// localStroage字符数据对象化
function __storage_to_obj(local_str){
  return JSON.parse(local_str);
}

// 将数据本地字符化
function __obj_to_storage(obj){
  return JSON.stringify(obj);
}

// 依据url获取测试队列归组
function __tester_array(testers, url){
  for(var i in testers){
    if(testers[i].url == url){
      return testers[i];
    }
  }

  return null;
}

/********************* 数据存储对象 **********************/
// 测试组
function TesterArray(url , tester_obj){
  this.url = url;
  this.tArray = new Array(tester_obj);
}
