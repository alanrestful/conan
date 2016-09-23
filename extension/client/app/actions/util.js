
export const form = { 'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8', 'x-requested-with': 'XMLHttpRequest', "Accept": "application/json" };
export const xhr = { 'x-requested-with': 'XMLHttpRequest', "Accept": "application/json" };
export const json = { 'Content-Type' : 'application/json', 'x-requested-with': 'XMLHttpRequest', "Accept": "application/json" };


export function noAuthToLogin(url, replace) {
  url = url || window.location.pathname + window.location.search
  if(!replace){
    window.location.href = "/login?target=" + url;
  }else if(/terminus/i.test(navigator.userAgent)) {
    window.location.href = "/login?target=" + url;
  }else {
    replace("/login?target=" + url);
  }
}

export function fetchCheckStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    return response.text().then((data)=>{
      let message
      try{
        message = JSON.parse(data).message
      }catch(e) {
        message = data
      }
      var errorObj = {data: message, status: response.status}
      throw errorObj
    })
  }
}

export function parseJSON(response) {
  return response.json()
}

export function parseText(response) {
  return response.text()
}

export function processSussess(options) {
  if(options.tipWords) {
    PubSub.publish('toast.info', options.tipWords);
  }
  if(typeof options.callback == "function") {
    options.callback()
  }
}

export function processError(errorObj, url, history) {
  if(errorObj.status == 401) {
    noAuthToLogin(url, history);
    PubSub.publish('toast.close');
  } else {
    PubSub.publish('toast.info', errorObj.data);
  }
}

export function goBack (history) {
  history.goBack();
}

export function toastFunction(toast, type, msg) {
  if(!msg){
    msg = '';
  }
  toast.setState({type: type, msg: msg});
}


export function fetchUtil(options) {
  let { url, method, body, headers, history, hrefCallback, otherErrorCallback } = options
  let fetchOptions = {
    method: method ? method : "GET",
    credentials: 'same-origin',
    headers: headers ? headers : "xhr",
  }
  if(fetchOptions.method != "GET") {
    fetchOptions.body = options.body
  }
  return fetch(url, fetchOptions)
  .then(fetchCheckStatus)
  .then(parseText)
  .then((data)=>{
    try{
      return JSON.parse(data)
    }catch(e) {
      return data
    }
  })
  .catch(errorObj=>{
    let href = hrefCallback ? hrefCallback : window.location.href;
    processError(errorObj, href, history.replace)
    if(typeof(otherErrorCallback) == "function") {
      otherErrorCallback()
    }
    return Promise.reject('end')
  })
}

export function actionCreator(type, obj) {
  obj = obj ? obj : {};
  obj.type = type
  return obj
}

/**
 * 清空conan的测试数据
 * index: 需要清空的数据索引，在整个测试用例组中
 * callback: 清空数据后回调
 */
export function cleanAllTArray(index, callback){
  chrome.storage.local.get('conan', function(result){
    var conanConfig = result.conan;

    if(index){
      conanConfig.tester_arrays.splice(index , 1);
    }else{
      conanConfig.tester_arrays = [];
    }

    chrome.storage.local.set(result);
    callback();
  });
}

/**
 * 获取所有的测试数据信息
 * @param callback获取数据后回调
 * 传入全部数据信息
 */
export function allTArrays(callback){
  chrome.storage.local.get('conan', function(result){
    var conanConfig = result.conan;

    var tArrays = conanConfig.tester_arrays;
    callback(tArrays);
  });
}

/**
 * 监听Chrome localStorage信息更变(测试数据)
 * @param arrayFun(tArray , index)
 * tArray:测试用例数据, index:在整个测试组中的位置
 * @param objFun(tObj , index)
 * tObj:测试元素, index:在测试用例中的位置
 */
export function listenerTarrayStorage(arrayFun, objFun){
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
 * 判断两个对象是否相同
 */
function __is_diff(old_obj, new_obj){
  for(var p in old_obj) {
      if(typeof(new_obj[p])=='undefined') {return true;}
  }

  for(var n in old_obj) {
    if (old_obj[n]) {
      switch(typeof(old_obj[n])) {
        case 'object':
          if (__is_diff(old_obj[n], new_obj[n])) { return true;} break;
        case 'function':
          break;
        default:
          if (old_obj[n] != new_obj[n]) { return true;}
      }
    } else {
      if (new_obj[p]){
        return true;
      }
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
function __diff_t_arrays(old_arrays , new_arrays, arrayFun, objFun){
  for(var newI in new_arrays){
    if(!old_arrays[newI]){
      //新增的测试组
      // time_line_layout(new_arrays[newI] , newI);
      // time_line_view(new_arrays[newI], newI);
      arrayFun(new_arrays[newI] , newI);
    }else if(__is_diff(old_arrays[newI], new_arrays[newI])){
      var oldArray = old_arrays[newI]["tArray"];
      var newArray = new_arrays[newI]["tArray"];
      for(var diffI in newArray){
        if(!oldArray[diffI]){
          // append_time_line(newArray[diffI] , newI);
          objFun(newArray[diffI] , newI);
        }
      }
    }
  }
}
