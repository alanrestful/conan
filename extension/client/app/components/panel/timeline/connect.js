import Timeline from "./index";
import { connect } from "react-redux";
import moment from "moment";
import { fetchUtil, actionCreator } from "../../../actions/util";

export default connect(state => {
  return {
    selectedPage: state.actions.selectedPage,
    action: state.actions.action
  };
}, dispatch => {
  return {

    /**
     * 删除指定页面
     * @param  {Int} index   索引
     * @param  {[type]} history [description]
     * @return {[type]}         [description]
     */
    deletePageByIndex: (index, history) => {
      clearAllTArray(index, () => {
        dispatch(actionCreator("DELETE_PAGE_BY_INDEX", { result: [] }));
      });
    }

  };
})(Timeline);
