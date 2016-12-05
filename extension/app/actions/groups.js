import { fetchUtil, json, actionCreator, openUrl, clientPlay, clientPlays } from "scripts/util";

/**
 * 获取分组
 * @param  {String} id      项目ID
 * @return {[type]}         [description]
 */
export const getAllDatas = id => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/super?pid=${id}`
    }).then(result => dispatch(actionCreator("SUCCESS_LOAD_ALL_DATAS", { result: result.result })));
  }
};

/**
 * 编辑模板
 * @param  {Object} model      模板信息
 * @param  {Array} groups 所有的模板组
 * @return {[type]}         [description]
 */
export const editModel = (model, groups) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/model`,
      method: "PUT",
      headers: json,
      body: JSON.stringify(model)
    }).then(result => {
      groups.map(v => {
        if(v.current.selected) {
          v.children.map(v => {
            if(v.current._id == model.mid) {
              v.current.name = model.name;
            }
          });
        }
      });
      dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ] }));
    });
  }
};

/**
 * 删除指定模板
 * @param  {Object} model  需要删除的模板
 * @param  {Array} groups 所有的模板组
 * @return {[type]}        [description]
 */
export const deleteModel = (model, groups) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/model?mid=${model._id}`,
      method: "DELETE"
    }).then(result => {
      groups.map((v, i) => {
        if(v.current.selected) {
          v.children.map((v, index) => {
            if(v.current._id == model._id) {
              groups[i].children.splice(index, 1);
            }
          })
        }
      });
      dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ] }));
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
 * @param  {Array} groups          用例信息
 * @param  {Array} cases        用例列表
 * @param  {Boolean} byName        是否根据名字来查找分组
 * @return {[type]}               [description]
 */
export const createCase = (groups, cases, byName) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/data`,
      method: "POST",
      headers: json,
      body: JSON.stringify(cases)
    }).then(result => {
      groups.map(v => {
        if(v.current.selected) { // (byName && v.current.name == cases.tempGroup) ||
          v.children.map(v => {
            if(v.current.selected) {
              v.children.push(result.result);
            }
          })
        }
      });
      dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ]}));
    });
  }
};

/**
 * 编辑用例
 * @param  {Object} c          用例信息
 * @param  {Array} cases        用例列表
 * @return {[type]}               [description]
 */
export const editCase = (groups, cases) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/data`,
      method: "PUT",
      headers: json,
      body: JSON.stringify(cases)
    }).then(result => {
      groups.map(v => {
        if(v.current.selected) {
          v.children.map(v => {
            if(v.current.selected) {
              v.children.map(v => {
                if(v._id == cases._id) {
                  v = cases;
                }
              });
            }
          });
        }
      });
      dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ]}));
    });
  }
};

// 两个问题，1，创建合并用例，2，编辑用例

/**
 * 编辑用例的预期
 * @param  {Object} c          用例信息
 * @param  {Array} cases        用例列表
 * @return {[type]}               [description]
 */
export const editCaseExpect = (groups, hash, value, cases) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/hdata`,
      method: "PUT",
      headers: json,
      body: JSON.stringify({ did: cases._id, hash, data: value })
    }).then(result => {
      groups.map(v => {
        if(v.current.selected) {
          v.children.map(v => {
            if(v.current.selected) {
              v.children.map(v => {
                if(v._id == cases._id) {
                  v.data = JSON.parse(v.data);
                  v.data[hash].expect = value;
                  v.data = JSON.stringify(v.data);
                }
              });
            }
          });
        }
      });
      dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ]}));
    });
  }
};

/**
 * 导出用例列表
 * @param  {Object} model 模板信息
 * @return {[type]}    [description]
 */
export const exportCase = model => {
  return dispatch => {
    openUrl(`/api/cases/json/${model._id}`);
  }
};

export const checkedGroups = (groups, groupId, checked) => {
  return dispatch => {
    groups.map(v => {
      if(v.current._id == groupId) {
        v.current.checked = checked;
        v.children.map(v => {
          v.current.checked = checked;
          v.children.map(v => {
            v.checked = checked;
          });
        });
      }
    });
    dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ] }));
  }
}

export const checkedModels = (groups, modelId, checked) => {
  return dispatch => {
    groups.map(v => {
      if(v.current.selected) {
        let length = 0;
        v.children.map(v => {
          if(v.current._id == modelId) {
            v.current.checked = checked;
            v.children.map(v => {
              v.checked = checked;
            })
          }
          if(v.current.checked) {
            length += 1;
          }
        });
        if(length == v.children.length) {
          v.current.checked = true;
          v.current.indeterminate = false;
        } else if(!length) {
          v.current.checked = false;
          v.current.indeterminate = false;
        } else {
          v.current.checked = false;
          v.current.indeterminate = true;
        }
      }
    });
    dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ] }));
  }
}

export const checkedCases = (groups, caseId, checked) => {
  return dispatch => {
    groups.map(v => {
      if(v.current.selected) {
        let l = 0,
            i = 0;
        v.children.map(v => {
          if(v.current.selected) {
            let length = 0;
            v.children.map(v => {
              if(v._id == caseId) {
                v.checked = checked;
              }
              if(v.checked) {
                length += 1;
              }
            })
            if(length == v.children.length) {
              v.current.checked = true;
              v.current.indeterminate = false;
            } else if(!length) {
              v.current.checked = false;
              v.current.indeterminate = false;
            } else {
              v.current.checked = false;
              v.current.indeterminate = true;
            }
          }
          if(v.current.checked) {
            l += 1;
          }
          if(v.current.indeterminate) {
            i += 1;
          }
        });
        if(l == v.children.length) {
          v.current.checked = true;
          v.current.indeterminate = false;
        } else if(!l && !i) {
          v.current.checked = false;
          v.current.indeterminate = false;
        } else {
          v.current.checked = false;
          v.current.indeterminate = true;
        }
      }
    });
    dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ] }));
  }
}

export const selectedGroup = (groups, groupId) => {
  return dispatch => {
    groups.map(v => {
      if(v.current._id == groupId) {
        v.current.selected = !v.current.selected;
      } else {
        delete v.current.selected;
        v.children.map(v => {
          delete v.current.selected;
          v.children.map(v => {
            delete v.selected;
          })
        });
      }
    });
    dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ] }));
  }
}

export const selectedModel = (groups, modelId) => {
  return dispatch => {
    groups.map(v => {
      if(v.current.selected == true) {
        v.children.map(v => {
          if(modelId == v.current._id) {
            v.current.selected = true;
          } else {
            delete v.current.selected;
          }
        });
      } else {
        v.children.map(v => {
          delete v.current.selected;
          v.children.map(v => {
            delete v.selected;
          })
        });
      }
    });
    dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ] }));
  }
}

export const selectedCase = (groups, caseId) => {
  return dispatch => {
    groups.map(v => {
      if(v.current.selected) {
        v.children.map(v => {
          if(v.current.selected) {
            v.children.map(v => {
              if(v._id == caseId) {
                v.selected = true;
              } else {
                delete v.selected;
              }
            })
          }
        });
      } else {
        delete v.current.selected;
        v.children.map(v => {
          delete v.current.selected;
          v.children.map(v => {
            delete v.selected;
          })
        });
      }
    });
    dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ] }));
  }
}

export const commonCaseExpect = (groups, id, fragment) => {
  return dispatch => {
    groups.map(v => {
      if(v.current.selected) {
        v.children.map(v => {
          if(v.current._id == id) {
            v.current.fragment = fragment;
          }
        });
      }
    });
    dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ] }));
  }
}

/**
 * 删除指定用例
 * @param  {Array} groups 所有的用例
 * @param  {Object} cases  需要删除的用例
 * @return {[type]}        [description]
 */
export const deleteCase = (groups, cases) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases/data?did=${cases._id}`,
      method: "DELETE"
    }).then(result => {
      groups.map((v, gi) => {
        if(v.current.selected) {
          v.children.map((v, mi) => {
            if(v.current.selected) {
              v.children.map((v, ci) => {
                if(v._id == cases._id) {
                  groups[gi].children[mi].children.splice(ci, 1);
                }
              });
            }
          });
        }
      });
      dispatch(actionCreator("SUCCESS_LOAD_GROUPS", { result: [ ...groups ]}));
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
