
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
