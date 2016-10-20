import { fetchUtil, actionCreator } from "scripts/util";

/**
 * 获取所有的项目信息
 * @return {[type]}         [description]
 */
export const getAllProjects = () => {
  return dispatch => {
    fetchUtil({
      url: "/api/projects"
    })
    .then(result => dispatch(actionCreator("SUCCESS_GET_PROJECTS", { result: result.result })));
  }
};

/**
 * 获取项目信息
 * @param  {Object} project 项目信息
 * @return {[type]}    [description]
 */
export const getProjectInfo = (project) => {
  return dispatch => {
    fetchUtil({
      url: `/api/projects/${project.id}`
    })
    .then(result => {
      dispatch(actionCreator("GET_PROJECT_INFO", { result: { id: result.result.id, ...result.result, ...project }}));
    });
  }
}
