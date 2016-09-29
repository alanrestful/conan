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

    getGroup: (id, history) => {
      fetchUtil({
        url: `/api/cases/groups?pid=${id}`
      }).then(result => dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: result.result })))
    },

    getModels: (id, history) => {
      fetchUtil({
        url: `/api/cases/models?gid=${id}`
      }).then(result => dispatch(actionCreator("SUCCESS_LOAD_MODELS", { result: result.result })))
    }
  }
})(Group);
