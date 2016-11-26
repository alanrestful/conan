import { fetchUtil, json, actionCreator, openUrl, clientPlay, clientPlays } from "scripts/util";

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
 * 删除指定模板
 * @param  {Object} model  需要删除的模板
 * @param  {Array} models 当前组所有的模板
 * @return {[type]}        [description]
 */
export const deleteModel = (model, models) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/model?mid=${model._id}`,
      method: "DELETE"
    }).then(result => {
      models.map((v, i) => {
        if(v._id == model._id) {
          models.splice(i, 1);
        }
      });
      dispatch(actionCreator("SUCCESS_DELETE_MODEL", { result: [ ...models ] }));
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
 * 删除指定组(废弃)
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
          groups.splice(i, 1);
        }
      });
      dispatch(actionCreator("SUCCESS_DELETE_GROUP", { result: groups }));
    });
  }
};

/**
 * 创建用例
 * @param  {Object} c          用例信息
 * @param  {Array} cases        用例列表
 * @return {[type]}               [description]
 */
export const createCase = (c, cases) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/data`,
      method: "POST",
      headers: json,
      body: JSON.stringify(c)
    }).then(result => {
      cases.push(result.result);
      dispatch(actionCreator("SUCCESS_CREATE_CASE", { result: [ ...cases ]}));
    });
  }
};

/**
 * 编辑用例
 * @param  {Object} c          用例信息
 * @param  {Array} cases        用例列表
 * @return {[type]}               [description]
 */
export const editCase = (c, cases) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/data`,
      method: "PUT",
      headers: json,
      body: JSON.stringify(c)
    }).then(result => {
      cases.map(v => {
        if(v._id == c._id) {
          v = c;
        }
        return v;
      });
      dispatch(actionCreator("SUCCESS_EDIT_CASE", { result: [ ...cases ]}));
    });
  }
};

/**
 * 编辑用例的预期
 * @param  {Object} c          用例信息
 * @param  {Array} cases        用例列表
 * @return {[type]}               [description]
 */
export const editCaseExpect = (c, hash, data, cases) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/hdata`,
      method: "PUT",
      headers: json,
      body: JSON.stringify({ did: c._id, hash, data })
    }).then(result => {
      cases.map(v => {
        if(v._id == c._id) {
          v.data = JSON.parse(v.data);
          v.data[hash].export = data;
          v.data = JSON.stringify(v.data);
        }
        return v;
      });
      dispatch(actionCreator("EDIT_CASE_EXPECT", { result: [ ...cases ]}));
    });
  }
};

/**
 * 获取用例列表
 * @param  {Object} model 模板信息
 * @return {[type]}    [description]
 */
export const getCases = model => {
  actionCreator("SUCCESS_LOAD_CASES", { result: undefined });
  return dispatch => {
    fetchUtil({
      url: `/api/cases/datas?mid=${model._id}`
    }).then(result => dispatch(actionCreator("SUCCESS_LOAD_CASES", { result: { selectedModel: model, cases: result.result }})));
  }
};

/**
 * 获取用例列表
 * @param  {Object} model 模板信息
 * @return {[type]}    [description]
 */
export const exportCase = model => {
  return dispatch => {
    openUrl(`/api/cases/json/${model._id}`);
  }
};

/**
 * 选择用例
 * @param  {Object} checkedIds 选择的用例Ids
 * @return {[type]}            [description]
 */
export const checkedCase = checkedIds => actionCreator("SET_CHECKED_IDS", { result: checkedIds })

/**
 * 删除指定用例
 * @param  {Object} c  需要删除的用例
 * @param  {Array} groups 所有的用例
 * @return {[type]}        [description]
 */
export const deleteCase = (c, cases) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/data?did=${c._id}`,
      method: "DELETE"
    }).then(result => {
      cases.map((v, i) => {
        if(v._id == c._id) {
          cases.splice(i, 1);
        }
      });
      dispatch(actionCreator("SUCCESS_DELETE_CASE", { result: [ ...cases ]}));
    });
  }
};

export const getPleySetting = () => {
  return dispatch => {
    let setting = localStorage.getItem("play");
    dispatch(actionCreator("GET_PLAY_SETTING", { result: setting ? JSON.parse(setting) : [ "chrome" ]}));
  }
}

export const setPlaySetting = (data) => {
  return dispatch => {
    data.defaults && localStorage.setItem("play", JSON.stringify(data));
    dispatch(actionCreator("SET_PLAY_SETTING", { result: data }));
  }
}
