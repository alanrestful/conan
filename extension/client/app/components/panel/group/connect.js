import Group from "./index";
import { connect } from "react-redux";
import { fetchUtil, actionCreator } from "../../../actions/util";

export default connect(state => {
  return {
    groups: state.groups.groups,
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
     * @param  {String} id      分组ID
     * @param  {[type]} history [description]
     * @return {[type]}         [description]
     */
    getModels: (id, history) => {
      fetchUtil({
        url: `/api/cases/models?gid=${id}`
      }).then(result => dispatch(actionCreator("SUCCESS_LOAD_MODELS", { result: result.result })))
    }
  }
})(Group);
