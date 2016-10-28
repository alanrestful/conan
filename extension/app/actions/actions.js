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
 * 选择页面
 * @param  {Int} index 索引
 * @return {[type]}       [description]
 */
export const pageActived = index => actionCreator("SET_ACTIVED_PAGE_INDEX", { result: index });

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
      }, drivers)
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

/**
 * 更改所选的动作
 * @param  {Object} data    所选的动作数据
 * @return {[type]}         [description]
 */
export const changeSelectedActions = data => actionCreator("CHANGE_SELECTED_ACTIONS", { result: data });

export const editExpect = (pageIndex, tIndex, actionIndex, value) => {
  return dispatch => {
    setElExpect(pageIndex, tIndex, actionIndex, value);
  }
}
