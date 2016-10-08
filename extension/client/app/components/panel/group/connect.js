import Group from "./index";
import { connect } from "react-redux";
import { fetchUtil, actionCreator } from "../../../actions/util";

export default connect(state => {
  return {
    groups: state.groups.groups,
    selectedGroup: state.groups.selectedGroup,
    project: state.projects.project
  }
}, dispatch => {
  return {

    /**
     * 获取分组
     * @param  {String} id      项目ID
     * @param  {[type]} history [description]
     * @return {[type]}         [description]
     */
    getGroup: (id, history) => {
      fetchUtil({
        url: `/api/cases/groups?pid=${id}`
      }).then(result => dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: result.result })))
    },

    /**
     * 获取模板
     * @param  {Object} group      分组信息
     * @param  {[type]} history [description]
     * @return {[type]}         [description]
     */
    getModels: (group, history) => {
      fetchUtil({
        url: `/api/cases/models?gid=${group._id}`
      }).then(result => dispatch(actionCreator("SUCCESS_LOAD_MODELS", { result: { models: result.result, selectedGroup: group } })))
    }
  }
})(Group);
