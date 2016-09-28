import Timeline from "./index";
import { connect } from "react-redux";
import moment from "moment";
import { fetchUtil, json, actionCreator } from "../../../actions/util";

export default connect(state => {
  return {
    pages: state.actions.pages,
    selectedPageIndex: state.actions.selectedPageIndex,
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
    },

    /**
     * 创建组
     * @param  {Object} data    组数据
     * @param  {[type]} history [description]
     * @return {[type]}         [description]
     */
    createGroups: (data, history) => {
      fetchUtil({
        url: "/api/cases/group",
        method: "POST",
        headers: json,
        body: JSON.stringify(data)
      }).then(result => dispatch(actionCreator("CREATE_GROUPS", { result })));
    }

  };
})(Timeline);
