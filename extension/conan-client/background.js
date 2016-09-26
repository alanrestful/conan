//初始化
init_localStorage();

function focusOrCreateTab(url) {
  chrome.windows.getAll({"populate":true}, function(windows) {
    var existing_tab = null;
    for (var i in windows) {
      var tabs = windows[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j];
        if (tab.url == url) {
          existing_tab = tab;
          break;
        }
      }
    }
    if (existing_tab) {
      chrome.tabs.update(existing_tab.id, {"selected":true});
    } else {
      chrome.tabs.create({"url":url, "selected":true});
    }
  });
}

// 为extension的点击监听
chrome.browserAction.onClicked.addListener(function(tab) {
  var manager_url = chrome.extension.getURL("manager.html");
  focusOrCreateTab(manager_url);
});

var port = null;
//监听chrome发送的message信息
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(typeof(request) === 'object'){
        connectToNative(request);
        return true;
      }else{
        chrome.tabs.sendMessage(request, "My name's alan!", function(response) {
            console.log(response.farewell);
        });
      }
    }
);

//onNativeDisconnect
function onDisconnected() {
    console.log(chrome.runtime.lastError);
    console.log('disconnected from native app.');
    port = null;
}

function onNativeMessage(message) {
    console.log('recieved message from native app: ' + JSON.stringify(message));
}

//connect to native host and get the communicatetion port
function connectToNative(msg) {
    var nativeHostName = "com.conan.client";
    port = chrome.runtime.connectNative(nativeHostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);

    port.postMessage(msg);
}

/**
 * content数据本地化
 */
chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    chrome.storage.local.get('conan', function(result){
      var conanConfig = result.conan;

      var testers = conanConfig.tester_arrays;

      var req_obj = typeof(request.data) == "object" ? request.data : JSON.parse(request.data);

      var obj = __tester_array(testers, sender.tab.url);
      if(obj == null){
        testers.push(new TesterArray(sender.tab.url, req_obj));
      }else{
        obj.tArray.push(req_obj);
      }

      chrome.storage.local.set(result);
    });
});

//初始化localstorage数据
function init_localStorage() {
  chrome.storage.local.get('conan', function(result){
      if(!result.conan){
        result.conan = {};
      }

      // 测试同步服务端
      if(!result.conan.testerServer){
        result.conan.testerServer = "http://localhost:9024";
      }

      // log日志级别
      if(!result.conan.logLevel){
        result.conan.logLevel = "log";
      }

      //默认是否同步数据
      if(!result.conan.syncTester){
        result.conan.syncTester = true;
      }

      //测试本地数据
      if(!result.conan.tester_arrays){
        result.conan.tester_arrays = [];
      }

      //待同步远端的数据
      if(!result.conan.needSyncTester){
        result.conan.needSyncTester = [];
      }

      //测试结果本地数据
      if(!result.conan.log_result){
        result.conan.log_result = [];
      }

      chrome.storage.local.set(result);
  });
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
function getDomainAndPath(urlPath){
  var reg = new RegExp('^(https?|ftp|file)://[-a-zA-Z0-9+&@#%?=~_|!:,.;]*[/]', 'gm');

  var oldDomainP = urlPath.match(reg)[0];
  var domain = oldDomainP.substring(0, oldDomainP.length-1);
  var path = urlPath.substring(domain.length , urlPath.length);

  return new Array(domain , path);
}

// 测试组(同一个页面)
function TesterArray(url , tester_obj){
  var domainPath = getDomainAndPath(url);

  this.url = url;
  this.domain = domainPath[0];
  this.path = domainPath[1]
  this.tArray = new Array(tester_obj);
}
