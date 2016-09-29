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

    getGroup: (data, history) => {
      fetchUtil({
        url: `/api/cases/groups?${data}`
      }).then(result => dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: result.result })))
    }
  }
})(Group);
