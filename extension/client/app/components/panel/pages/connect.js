import Pages from "./index";
import { connect } from "react-redux";
import moment from "moment";
import { clearAllTArray, allTArrays, listenerTarrayStorage, fetchUtil, actionCreator } from "../../../actions/util";

export default connect((state) => {
  return {
    pages: state.actions.pages,
    page: state.actions.page,
    action: state.actions.action
  };
}, (dispatch) => {
  return {

    /**
     * 获取页面或者动作
     * @param  {Object} history history对象
     * @return {[type]}         [description]
     */
    getActionData: (history) => {
      allTArrays(result => {
        console.log("000", result);
        dispatch(actionCreator("SUCCESS_LOAD_PAGES", { result }));
      })
      listenerTarrayStorage(result => {
        console.log(111, result);
        dispatch(actionCreator("PRODUCE_NEW_PAGE", { result: { ...result, createAt: moment().format("YYYY-MM-DD HH:mm:ss") } }));
      }, result => {
        console.log(222, result);
        dispatch(actionCreator("PRODUCE_NEW_ACTION", { result: { ...result, createAt: moment().format("YYYY-MM-DD HH:mm:ss") } }));
      });
    },

    /**
     * 清空所有页面
     * @param  {Object} history history对象
     * @return {[type]}         [description]
     */
    clearAllPages: (history) => {
      // clearAllTArray();
    },

    pageActived: (selectedPage) => {
      dispatch(actionCreator("SET_ACTIVED_ACTIONS", { result: selectedPage }));
    }

  }
})(Pages);
