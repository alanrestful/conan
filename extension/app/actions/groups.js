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
 * 编辑模板
 * @param  {Object} model      模板信息
 * @return {[type]}         [description]
 */
export const editModel = (model, models) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/model`,
      method: "PUT",
      headers: json,
      body: JSON.stringify(model)
    }).then(result => {
      models = models.map(v => {
        if(v._id == model.mid) {
          v.name = model.name;
        }
        return v;
      });
      dispatch(actionCreator("SUCCESS_EDIT_MODEL", { result: [ ...models ] }));
    });
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

export const createCase = (info, groups, selectedGroup, models) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases`,
      method: "POST",
      headers: json,
      body: JSON.stringify(info)
    }).then(result => {
      if(selectedGroup.name == info.tempGroup) {
        models.push(result.result.model);
      } else {
        let status = false;
        groups.map(v => {
          if(v.name == info.tempGroup) {
            status = true;
          }
        });
        !status && groups.push(result.result.group);
      }
      dispatch(actionCreator("SUCCESS_CREATE_CASE", { result: { groups: [ ...groups ], models: [ ...models ] } }));
    });
  }
};

export const getCases = id => {
  actionCreator("SUCCESS_LOAD_CASES", { result: undefined });
  return dispatch => {
    fetchUtil({
      url: `/api/cases/datas?mid=${id}`
    }).then(result => dispatch(actionCreator("SUCCESS_LOAD_CASES", { result: result.result })));
  }
};
