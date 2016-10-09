import GroupDetail from "./index";
import { connect } from "react-redux";
import { fetchUtil, actionCreator } from "../../../actions/util";

export default connect(state => {
  return {
    groups: state.groups.groups,
    selectedGroup: state.groups.selectedGroup,
    models: state.groups.models
  }
}, dispatch => {
  return {

    deleteGroup: (group, groups) => {
      fetchUtil({
        url: `/api/cases/groups?gid=${group._id}`,
        method: "DELETE"
      }).then(result => {
        groups.map((v, i) => {
          if(v._id == group._id) {
            delete groups[i];
          }
        })
        dispatch(actionCreator("SUCCESS_DELETE_GROUP", { result: groups }))
      })
    }
  }
})(GroupDetail);
