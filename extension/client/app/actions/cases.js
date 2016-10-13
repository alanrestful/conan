import { fetchUtil, json, actionCreator, clientPlay } from "scripts/util";

export const createCase = (info) => {
  return dispatch => {
    fetchUtil({
      url: `/api/cases`,
      method: "POST",
      headers: json,
      body: JSON.stringify(info)
    }).then(result => {
      dispatch(actionCreator("SUCCESS_CREATE_CASE", { result: groups }));
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
