import GroupDetail from "./index";
import { connect } from "react-redux";
import { fetchUtil, json, actionCreator, clientPlay } from "scripts/util";

export default connect(state => {
  return {
    groups: state.groups.groups,
    selectedGroup: state.groups.selectedGroup,
    models: state.groups.models,
    project: state.projects.project
  }
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
