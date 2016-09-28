import Setting from "./index";
import { connect } from "react-redux";
import { fetchUtil, actionCreator } from "../../../actions/util";

export default connect(state => {
  return {
    projects: state.projects.projects
  }
}, dispatch => {
  return {

    /**
     * 获取所有的项目信息
     * @param  {[type]} history [description]
     * @return {[type]}         [description]
     */
    getAllProjects: history => {
      fetchUtil({
        url: "/api/projects",
        history
      })
      .then(result => dispatch(actionCreator("SUCCESS_GET_PROJECTS", { result })));
    },

    setProjectInfo: (data, history) => {
      dispatch(actionCreator(""))
    }
  }
})(Setting);
