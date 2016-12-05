import moment from "moment";
import { initConnect, allTArrays, listenerTarrayStorage, initNativeMessage, clientInit, clientPlay, clientPlays, clearAllTArray, setElExpect, fetchUtil, json, actionCreator } from "scripts/util";


export const init = () => {
  return dispatch => {
    // 这个需要在页面加载时候就调用
    initConnect();

    //数据回调
    initNativeMessage(() => {
      console.log("clientInitSuccess");
    }, (error) => {
      console.log("clientInitFailed");
      console.log(error);
    }, (error) => {
      console.log("clientDisconnected");
      console.log(error);
    }, (result) => {
      console.log("clientPlayRes");
      console.log(result)
      dispatch(actionCreator("SUCCESS_LOAD_RESULT", { result }));
      dispatch(actionCreator("SUCCESS_LOAD_RESULT", { result: undefined }));
    });

    clientInit();

    dispatch(actionCreator("SUCCESS_INIT_CONNECT", { result: true }));
  }
}
/**
 * 获取页面或者动作
 * @return {[type]}         [description]
 */
export const getActionData = () => {
  return dispatch => {
    allTArrays(result => {
      dispatch(actionCreator("SUCCESS_LOAD_PAGES", { result }));
    });

    listenerTarrayStorage(result => {
      dispatch(actionCreator("PRODUCE_NEW_PAGE", { result: { ...result, createAt: moment().format("YYYY-MM-DD HH:mm:ss") } }));
    }, result => {
      dispatch(actionCreator("PRODUCE_NEW_ACTION", { result: { ...result, createAt: moment().format("YYYY-MM-DD HH:mm:ss") } }));
    });
  }
};

export const setPages = pages => actionCreator("SUCCESS_LOAD_PAGES", { result: [ ...pages ]});

/**
 * 删除指定页面
 * @param  {Int}   index    页面索引
 * @param  {Array}   pages    所有页面
 * @param  {Function} callback 回调
 * @return {[type]}            [description]
 */
export const deletePage = (index, pages, callback) => {
  return dispatch => {
    clearAllTArray(index, () => {
      pages.splice(index, 1);
      dispatch(actionCreator("DELETE_PAGE_BY_INDEX", { result: [ ...pages ]}));
      callback instanceof Function && callback();
    });
  }
};

/**
 * 清空所有页面
 * @param  {Function} callback 回调
 * @return {[type]}         [description]
 */
export const clearAllPages = callback => {
  return dispatch => {
    clearAllTArray(null, () => {
      dispatch(actionCreator("DELETE_ALL_PAGES", { result: [] }));
      callback instanceof Function && callback();
    });
  }
};

/**
 * 回放
 * @param  {Object} data    回放数据
 * @return {[type]}         [description]
 */
export const playback  = (data, drivers, background) => {
  return dispatch => {
    if(data instanceof Array || background) {
      clientPlays({
        method: "plays",
        data
      }, drivers);
    } else {
      clientPlay({
        method: "play",
        data
      }, drivers);
    }
  }
};

/**
 * 创建组
 * @param  {Object} data    组数据
 * @return {[type]}         [description]
 */
export const createGroups = data => {
  return dispatch => {
    fetchUtil({
      url: "/api/cases/group",
      method: "POST",
      headers: json,
      body: JSON.stringify(data)
    }).then(result => dispatch(actionCreator("CREATE_GROUPS", { result })));
  }
};

export const checkedPages = (pages, index, checked) => {
  return dispatch => {
    pages.map((v, i) => {
      if(i == index) {
        v.checked = checked;
        v.indeterminate = false;
        v.tArray[0].map(v => {
          v.checked = checked;
        });
      }
    });
    dispatch(actionCreator("SUCCESS_LOAD_PAGES", { result: [ ...pages ]}));
  }
}

export const checkedActions = (pages, index, checked) => {
  return dispatch => {
    pages.map(v => {
      if(v.selected) {
        let length = 0;
        v.tArray[0].map((v, i) => {
          if(i == index) {
            v.checked = checked;
          }
          if(v.checked) {
            length += 1;
          }
        });
        if(length == v.tArray[0].length) {
          v.checked = true;
          v.indeterminate = false;
        } else if(!length) {
          v.checked = false;
          v.indeterminate = false;
        } else {
          v.checked = false;
          v.indeterminate = true;
        }
      }
    });
    dispatch(actionCreator("SUCCESS_LOAD_PAGES", { result: [ ...pages ]}));
  }
}

export const selectedPages = (pages, index) => {
  return dispatch => {
    pages.map((v, i) => {
      if(i == index) {
        v.selected = true;
      } else {
        v.selected = false;
      }
    });
    dispatch(actionCreator("SUCCESS_LOAD_PAGES", { result: [ ...pages ]}));
  }
}

export const editExpect = (pageIndex, tIndex, actionIndex, value) => {
  return dispatch => {
    setElExpect(pageIndex, tIndex, actionIndex, value);
  }
}
