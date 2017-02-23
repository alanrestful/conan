//初始化
init_localStorage();

function focusOrCreateTab(url) {
  chrome.windows.getAll({"populate":true}, function(windows) {
    var existing_tab = null;
    for (var i in windows) {
      var tabs = windows[i].tabs;
      for (var j in tabs) {
        var tab = tabs[j];
        var index = tab.url.indexOf("index.html");
        if ((index != -1 ? tab.url.slice(0, index+10) : tab.url) == url) {
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
  var manager_url = chrome.extension.getURL("index.html");
  focusOrCreateTab(manager_url);
});

// 设置native message传输
var __conan_client = null;
// 设置extesion的页面id
var __tab_id = null;
//监听chrome发送的message信息
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    chrome.storage.local.get('conan', function(result){
      //默认系统参数设置
      console.log(request.method);
      switch(request.method){
        case "connectInit":
          // 连接初始化
          __tab_id = request.tabId;
          break;
        case "clientInit":
          // 初始化native message
          __initNative();
          break;
        case "clientPlay":
          // 测试用例回归
          console.log(request.tDeal);
          if(result.conan.syncCookie){
            setCookie(request.tDeal, function(cookies){
              request.tDeal["webDrivers"] = request.webDrivers ? request.webDrivers : ["chrome"];
              request.tDeal["cookies"] = cookies;
              __on_sendToNative(request.tDeal);
            });
          } else {
            request.tDeal["webDrivers"] = request.webDrivers ? request.webDrivers : ["chrome"];
            __on_sendToNative(request.tDeal);
          }
          
          break;
        case "clientPlays":
          // 批量测试用例回归
          console.log(request.tDeal);
          if(result.conan.syncCookie){
            setCookie(request.tDeal, function(cookies){
              request.tDeal["webDriver"] = request.webDriver ? request.webDriver : "phantomjs";
              request.tDeal["cookies"] = cookies;
              __on_sendToNative(request.tDeal);
            });
          } else {
            request.tDeal["webDriver"] = request.webDriver ? request.webDriver : "phantomjs";
            __on_sendToNative(request.tDeal);
          }
          break;
        default:
          // 错误请求类型
          console.log("Undefined request method "+request.method);
      }
    });
  }
);

/**
 * 消息传递到管理页面
 * 存在异步IO问题
 */
function __send_to_page(message){
  if(__tab_id){
    chrome.tabs.sendMessage(__tab_id, message);
  }else{
    setTimeout(function(){__send_to_page(message)}, 100);
  }
}

// 先单例跑，后期切换成多线程
function __initNative(){
  try{
    if(__conan_client === null){
      var nativeHostName = "com.conan.client";
      __conan_client = chrome.runtime.connectNative(nativeHostName);
      __conan_client.onMessage.addListener(__on_nativeMessage);
      __conan_client.onDisconnect.addListener(__on_disconnected);
    }
    __send_to_page({"event": "clientInitSuccess"});
  }catch(e){
    __send_to_page({"event": "clientInitFailed", "error": e});
  }
}

// 与native message失去连接
function __on_disconnected() {
  __send_to_page({"event": "clientDisconnected", "error": chrome.runtime.lastError});
  __conan_client = null;
}

// 获取native返回的处理结果数据
function __on_nativeMessage(message) {
  console.log(message);
  //记录测试结果到本地
  chrome.storage.local.get('conan', function(result){
    var conanValue = result.conan;
    conanValue.expectRes.push(message);

    chrome.storage.local.set(result);
  });

  __send_to_page({"event": "clientPlayRes", "data": message});
}

// 调用native处理case
function __on_sendToNative(message) {
  var nativeHostName = "com.conan.client";
  __conan_client = chrome.runtime.connectNative(nativeHostName);
  __conan_client.onMessage.addListener(__on_nativeMessage);
  __conan_client.onDisconnect.addListener(__on_disconnected);

  __conan_client.postMessage(message);
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
      if(obj === null){
        testers.push(new TesterArray(sender.tab.url, req_obj));
      }else{
        obj.tArray[0].push(req_obj);
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

      //默认同步当前浏览器cookie
      if(!result.conan.syncCookie){
        result.conan.syncCookie = true;
      }

      //测试本地数据
      if(!result.conan.tester_arrays){
        result.conan.tester_arrays = [];
      }

      //待同步远端的数据
      if(!result.conan.needSyncTester){
        result.conan.needSyncTester = [];
      }

      //测试结果本地化
      if(!result.conan.expectRes){
        result.conan.expectRes = [];
      }

      // 测试的webDriver设置
      if(!result.conan.webDrivers || result.conan.webDrivers.length === 0){
        result.conan.webDrivers = new Object();
        result.conan.webDrivers["chrome"] = "/usr/local/bin/";
        result.conan.webDrivers["firefox"] = "/usr/local/bin/";
        result.conan.webDrivers["opera"] = "/usr/local/bin/";
        result.conan.webDrivers["safari"] = "/usr/local/bin/";
        result.conan.webDrivers["phantomjs"] = "/usr/local/bin/";
        result.conan.webDrivers["android"] = "/usr/local/bin/";
        result.conan.webDrivers["iPad"] = "/usr/local/bin/";
        result.conan.webDrivers["iPhone"] = "/usr/local/bin/";
      }

      //白名单（白名单内的url设置页面监听）
      if(!result.conan.whiteLists){
        result.conan.whiteLists = [];
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
  this.path = domainPath[1];
  this.tArray = new Array(new Array(tester_obj));
}

/********************* Cookie **********************/
function setCookie(tDeal , callback){
  var cookieUrl = tDeal.data instanceof Array ? tDeal.data[0]["domain"] : tDeal.data["domain"];

  chrome.cookies.getAll({url: cookieUrl}, function(cookies){
    callback(cookies);
  })
}

// chrome.webRequest.onBeforeRequest.addListener(function(details) {
//   console.log(details.url);
// },{
//     urls: ["http://*/*", "https://*/*"]
// }, ["blocking"]);