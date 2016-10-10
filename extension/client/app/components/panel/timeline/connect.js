import Timeline from "./index";
import { connect } from "react-redux";
import moment from "moment";
import { fetchUtil, json, actionCreator, clientPlay } from "scripts/util";

export default connect(state => {
  return {
    pages: state.actions.pages,
    selectedPageIndex: state.actions.selectedPageIndex,
    action: state.actions.action,
    selectedActions: state.actions.selectedActions,
    project: state.projects.project
  };
}, dispatch => {
  return {

    /**
     * 回放
     * @param  {Object} data    回放数据
     * @param  {[type]} history [description]
     * @return {[type]}         [description]
     */
    playback: (data, history) => {
      clientPlay({
        method: "play",
        data
      })
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
    },

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
     * 更改所选的动作
     * @param  {Object} data    所选的动作数据
     * @param  {[type]} history [description]
     * @return {[type]}         [description]
     */
    changeSelectedActions: (data, history) => {
      dispatch(actionCreator("CHANGE_SELECTED_ACTIONS", { result: data }));
    }

  };
})(Timeline);
