import GroupDetail from "./index";
import { connect } from "react-redux";
import { fetchUtil, actionCreator } from "../../../actions/util";

export default connect(state => {
  return {
    selectedGroup: state.groups.selectedGroup,
    models: state.groups.models
  }
}, dispatch => {
  return {
  }
})(GroupDetail);
