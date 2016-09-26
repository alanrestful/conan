import Pages from "./index";
import { connect } from "react-redux";
import moment from "moment";
import { initConnect, allTArrays, listenerTarrayStorage, initNativeMessage, clientInit, clientPlay, clearAllTArray, fetchUtil, actionCreator } from "../../../actions/util";

export default connect(state => {
  return {
    pages: state.actions.pages,
    page: state.actions.page,
    action: state.actions.action
  };
}, dispatch => {
  return {

    /**
     * 获取页面或者动作
     * @param  {Object} history history对象
     * @return {[type]}         [description]
     */
    getActionData: history => {
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

      clientPlay({"domain":"http://mallt.jidd.com.cn:8888","path":"/","tArray":[{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"loginId","isFormEl":true,"name":"loginBy","placeholder":"请输入用户名","tagName":"INPUT","type":"text","value":"滦县鹏大商贸有限公司","xPath":"//*[@id='loginId']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"form-control","id":"password","isFormEl":true,"name":"password","placeholder":"请输入密码","tagName":"INPUT","type":"password","value":"123456","xPath":"//*[@id='password']"},{"baseURI":"http://mallt.jidd.com.cn:8888/","className":"btn","innerText":"登录","isFormEl":false,"tagName":"BUTTON","type":"submit","xPath":"//*[@class='user-login-form']/button[1]"}],"url":"http://mallt.jidd.com.cn:8888/"});
    },

    /**
     * 清空所有页面
     * @param  {Object} history history对象
     * @return {[type]}         [description]
     */
    clearAllPages: history => {
      // clearAllTArray();
    },

    pageActived: selectedPage => {
      dispatch(actionCreator("SET_ACTIVED_ACTIONS", { result: selectedPage }));
    }

  }
})(Pages);
