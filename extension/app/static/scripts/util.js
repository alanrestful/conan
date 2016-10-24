export const form = { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8', 'x-requested-with': 'XMLHttpRequest', "Accept": "application/json" };
export const xhr = { 'x-requested-with': 'XMLHttpRequest', "Accept": "application/json" };
export const json = { 'Content-Type' : 'application/json', 'x-requested-with': 'XMLHttpRequest', "Accept": "application/json" };

export const fetchCheckStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    return response.text().then(data => {
      let message;
      try {
        message = JSON.parse(data).message;
      } catch(e) {
        message = data;
      }
      throw { data: message, status: response.status };
    })
  }
}

export const parseJSON = response => {
  return response.json();
}

export const parseText = response => {
  return response.text();
}

export const processSussess = options => {
  if(options.tipWords) {
    PubSub.publish('toast.info', options.tipWords);
  }
  options.callback instanceof Function && options.callback();
}

export const processError = (error, url, history) => {
  if(error.status == 401) {
    noAuthToLogin(url, history);
    PubSub.publish('toast.close');
  } else {
    PubSub.publish('toast.info', error.data);
  }
}

export const goBack = history => {
  history.goBack();
}

export const toastFunction = (toast, type, msg) => {
  if(!msg){
    msg = "";
  }
  toast.setState({ type: type, msg: msg });
}


export const fetchUtil = options => {
  let { url, method, body, headers, history, hrefCallback, otherErrorCallback } = options;
  let fetchOptions = {
    method: method ? method : "GET",
    credentials: 'same-origin',
    headers: headers ? headers : "xhr",
  }
  if(fetchOptions.method != "GET") {
    fetchOptions.body = options.body;
  }
  let config = localStorage.getItem("config");
  if(config) {
    config = JSON.parse(config);
  }
  return fetch(`${config.testerServer}${url}`, fetchOptions)
  .then(fetchCheckStatus)
  .then(parseText)
  .then(data => {
    try {
      return JSON.parse(data);
    }catch(e) {
      return data;
    }
  })
  .catch(error => {
    processError(error, hrefCallback ? hrefCallback : location.href, history.replace)
    otherErrorCallback instanceof Function && otherErrorCallback();
    return Promise.reject("end");
  })
}

export const actionCreator = (type, action) => {
  return {
    type,
    ...action
  };
}

/**
 * 初始化通信链接
 */
export const initConnect = () => {
  chrome.tabs.getCurrent(function(tab) {
    chrome.runtime.sendMessage({"method": "connectInit", "tabId" : tab.id});
  });
}

/**
 * 初始化native通信设置
 */
export const clientInit = () => {
  chrome.runtime.sendMessage({"method": "clientInit"});
}

/**
 * 设置webDriver
 * driver: web引擎(chrome|firefox|ie|opera|safari|android|MicrosoftEdge|iPad|iPhone|phantomjs|htmlunit)
 * path: webDriver地址
 */
export const configWebDriver = (driver, path) => {
  chrome.storage.local.get('conan', function(result){
    var conanConfig = result.conan;

    conanConfig.webDrivers[driver] = path;

    chrome.storage.local.set(result);
  });
}

/**
 * 设置Client配置(默认)
 *{
 *   "testerServer": "http://localhost:9024",
 *   "logLevel" : "log",
 *   "syncTester" : "true"
 *}
 *
 */
export const configClientDefault = config => {
  chrome.storage.local.get('conan', function(result){
    var conanConfig = result.conan;

    // 测试server的
    if(!config.testerServer){
      conanConfig.testerServer = config.testerServer;
    }

    // log日志级别
    if(!config.logLevel){
      conanConfig.logLevel = config.logLevel;
    }

    //默认是否同步数据
    if(!config.syncTester){
      conanConfig.syncTester = config.syncTester;
    }

    chrome.storage.local.set(result);
  });
}

/**
 * case的回归测试
 * tDeal:测试数据内容（传递到native message的）
 * webDrivers:需要测试的webDriver（默认[chrome]）
 * tDeal:
 * {
 *  "method": "play",
 *  "data": "[tArray(测试用例JSON数据)]"
 * }
 */
export const clientPlay = (tDeal, webDrivers) => {
  chrome.runtime.sendMessage({"method": "clientPlay", "tDeal": tDeal, "webDrivers": webDrivers});
}

/**
 * 与background的基本信息监听
 * initSuccess
 * 成功初始化本地node处理程序(由clientInit | clientPlay引起的回调)
 * initFailed
 * 初始化本地node程序失败(入参：初始化失败原因)(由clientInit | clientPlay引起的回调)
 * discounect
 * 断开与nativemessage时调用(入参：调用失败原因)(由clientInit | clientPlay引起的回调)
 * playRes
 * 调用本地处理程序的处理结果(入参：native调用结果)(由clientPlay引起的回调)
 */
export const initNativeMessage = (initSuccess, initFailed, disconnect, playRes) => {
  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
    switch(request.event){
      case "clientInitSuccess":
        // 成功初始化native message监听
        initSuccess();
        break;
      case "clientInitFailed":
        // 初始化native message失败监听
        initFailed(request.error);
        break;
      case "clientDisconnected":
        // 断开native message时间
        disconnect(request.error);
        break;
      case "clientPlayRes":
        // 测试用例回归结果监听
        playRes(request.data);
        break;
    }
  });
}

/**
 * 清空conan的测试数据
 * index: 需要清空的数据索引，在整个测试用例组中
 * callback: 清空数据后回调
 */
export const clearAllTArray = (index, callback) => {
  chrome.storage.local.get('conan', function(result){
    var conanConfig = result.conan;

    if(index){
      conanConfig.tester_arrays.splice(index , 1);
    }else{
      conanConfig.tester_arrays = [];
    }

    chrome.storage.local.set(result);
    callback instanceof Function && callback();
  });
}

/**
 * 获取所有的测试数据信息
 * @param callback获取数据后回调
 * 传入全部数据信息
 */
export const allTArrays = callback => {
  chrome.storage.local.get('conan', function(result){
    var conanConfig = result.conan;

    var tArrays = conanConfig.tester_arrays;
    callback instanceof Function && callback(tArrays);
  });
}

/**
 * 监听Chrome localStorage信息更变(测试数据)
 * @param arrayFun(tArray , index)
 * tArray:测试用例数据, index:在整个测试组中的位置
 * @param objFun(tObj , index)
 * tObj:测试元素, index:在测试用例中的位置
 */
export const listenerTarrayStorage = (arrayFun, objFun) => {
  chrome.storage.onChanged.addListener(function(changes, namespace){
    for(var key in changes){
      let storageChange = changes[key];

      if(storageChange.oldValue.tester_arrays != storageChange.newValue.tester_arrays) {
        // 数据是否有改动
        __diff_t_arrays(storageChange.oldValue.tester_arrays , storageChange.newValue.tester_arrays, arrayFun, objFun);
      }
    }
  });
}

/**
 * 设置预设结果
 * tIndex: case在队列索引
 * arrayIndex: 在case中tArray的索引
 * objIndex: 在tArray中的索引
 * expect: 预设结果
 */
export const setElExpect = (tIndex, arrayIndex, objIndex, expect) => {
  chrome.storage.local.get('conan', function(result){
    var conanConfig = result.conan;

    // 设置预期结果
    var tObj = conanConfig.tester_arrays[tIndex][arrayIndex][objIndex];
    tObj["expect"] = expect

    chrome.storage.local.set(result);
  });
}

/**
 * 判断两个对象是否相同
 */
const __is_diff = (old_obj, new_obj) => {
  for(var p in old_obj) {
      if(typeof(new_obj[p])=='undefined') {return true;}
  }

  for(var n in old_obj) {
    switch(typeof(old_obj[n])) {
      case 'object':
        if (__is_diff(old_obj[n], new_obj[n])) { return true;} break;
      case 'function':
        break;
      default:
        if (old_obj[n] != new_obj[n]) { return true;}
    }
  }

  for(var m in new_obj) {
    if(typeof(old_obj[m]) == 'undefined') {return true;}
  }
  return false;
}

/**
 * 获取数据是否有改动
 */
const __diff_t_arrays = (old_arrays , new_arrays, arrayFun, objFun) => {
  for(var newI in new_arrays){
    if(!old_arrays[newI]){
      //新增的测试组
      arrayFun(new_arrays[newI] , newI);
    }else if(__is_diff(old_arrays[newI], new_arrays[newI])){
      var oldArray = old_arrays[newI]["tArray"][0];
      var newArray = new_arrays[newI]["tArray"][0];
      for(var diffI in newArray){
        if(!oldArray[diffI]){
          objFun(newArray[diffI] , newI);
        }
      }
    }
  }
}
