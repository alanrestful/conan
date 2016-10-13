import { fetchUtil, json, actionCreator, clientPlay } from "scripts/util";

export const createCase = (group, groups) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases?gid=${group._id}`,
      method: "POST"
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

export const getCases = id => {
  actionCreator("SUCCESS_LOAD_CASES", { result: undefined });
  return dispatch => {
    fetchUtil({
      url: `/api/cases/datas?mid=${id}`
    }).then(result => dispatch(actionCreator("SUCCESS_LOAD_CASES", { result: result.result })));
  }
};
