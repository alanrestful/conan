import moment from "moment";
import { initConnect, allTArrays, listenerTarrayStorage, initNativeMessage, clientInit, clientPlay, clearAllTArray, fetchUtil, actionCreator } from "scripts/util";

/**
 * 获取页面或者动作
 * @return {[type]}         [description]
 */
export const getActionData = () => {
  return dispatch => {
    // 这个需要在页面加载时候就调用
    initConnect();

    allTArrays(result => {
      console.log("000", result);
      dispatch(actionCreator("SUCCESS_LOAD_PAGES", { result }));
    });

    listenerTarrayStorage(result => {
      console.log(111, result);
      dispatch(actionCreator("PRODUCE_NEW_PAGE", { result: { ...result, createAt: moment().format("YYYY-MM-DD HH:mm:ss") } }));
    }, result => {
      console.log(222, result);
      dispatch(actionCreator("PRODUCE_NEW_ACTION", { result: { ...result, createAt: moment().format("YYYY-MM-DD HH:mm:ss") } }));
    });

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
    });

    clientInit();

    // clientPlay({"method":"play","data":{"domain":"http://mallt.jidd.com.cn:8888","path":"/","tArray":[[{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"loginId","isFormEl":true,"name":"loginBy","placeholder":"请输入用户名","tagName":"INPUT","type":"text","value":"滦县鹏大商贸有限公司","xPath":"//*[@id='loginId']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"password","isFormEl":true,"name":"password","placeholder":"请输入密码","tagName":"INPUT","type":"password","value":"123456","xPath":"//*[@id='password']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"btn","innerText":"登录","isFormEl":false,"tagName":"BUTTON","type":"submit","xPath":"//*[@class='user-login-form']/button[1]"}]],"url":"http://mallt.jidd.com.cn:8888/"}});
  }
};

/**
 * 清空所有页面
 * @return {[type]}         [description]
 */
export const clearAllPages = () => {
  return dispatch => {
    clearAllTArray(null, () => {
      dispatch(actionCreator("DELETE_ALL_PAGES", { result: [] }));
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
export const playback  = data => {
  return dispatch => {
    clientPlay({
      method: "play",
      data
    });
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
 * 删除指定页面
 * @param  {Int} index   索引
 * @return {[type]}         [description]
 */
export const deletePageByIndex = index => {
  return dispatch => {
    clearAllTArray(index, () => {
      dispatch(actionCreator("DELETE_PAGE_BY_INDEX", { result: [] }));
    });
  }
};

/**
 * 更改所选的动作
 * @param  {Object} data    所选的动作数据
 * @return {[type]}         [description]
 */
export const changeSelectedActions = data => actionCreator("CHANGE_SELECTED_ACTIONS", { result: data });