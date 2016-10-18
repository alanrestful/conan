import { fetchUtil, actionCreator } from "scripts/util";

/**
 * 获取所有的项目信息
 * @return {[type]}         [description]
 */
export const getAllProjects = () => {
  return dispatch => {
    fetchUtil({
      url: "/api/projects",
      history
    })
    .then(result => dispatch(actionCreator("SUCCESS_GET_PROJECTS", { result: result.result })));
  }
};

/**
 * 设置项目信息
 * @param  {Object} data 项目信息
 * @return {[type]}      [description]
 */
export const setProjectInfo = data => actionCreator("SET_PROJECT_INFO", { result: data });

/**
 * 设置客户端配置
 * @param  {Object} data 配置信息
 * @return {[type]}      [description]
 */
export const setClientConfig = data => actionCreator("SET_CLIENT_CONFIG", { result: data });
