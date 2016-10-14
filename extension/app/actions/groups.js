import { fetchUtil, json, actionCreator, clientPlay } from "scripts/util";

/**
 * 获取分组
 * @param  {String} id      项目ID
 * @return {[type]}         [description]
 */
export const getGroup = id => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/groups?pid=${id}`
    }).then(result => dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: result.result })));
  }
};

/**
 * 获取模板
 * @param  {Object} group      分组信息
 * @return {[type]}         [description]
 */
export const getModels = group => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/models?gid=${group._id}`
    }).then(result => dispatch(actionCreator("SUCCESS_LOAD_MODELS", { result: { models: result.result, selectedGroup: group } })));
  }
};

/**
 * 选中模板
 * @param  {Object} data 模板信息
 * @return {[type]}      [description]
 */
export const checkedModel = data => actionCreator("SUCCESS_CHECKED_MODELS", { result: data });

/**
 * 删除指定组
 * @param  {Object} group  需要删除的组
 * @param  {Array} groups 所有的组
 * @return {[type]}        [description]
 */
export const deleteGroup = (group, groups) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/groups?gid=${group._id}`,
      method: "DELETE"
    }).then(result => {
      groups.map((v, i) => {
        if(v._id == group._id) {
          delete groups[i];
        }
      });
      dispatch(actionCreator("SUCCESS_DELETE_GROUP", { result: groups }));
    });
  }
};
