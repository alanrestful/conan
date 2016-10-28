import moment from "moment";
import { getExpectRes, clearExpectRes, fetchUtil, json, actionCreator } from "scripts/util";

export const getAllResult = () => {
  return dispatch => {
    getExpectRes(results => {
      dispatch({ type: "GET_ALL_RESULTS", results });
    });
  }
};

export const clearAllResult = () => {
  return dispatch => {
    clearExpectRes(data => {
      console.log(data)
      dispatch({ type: "CLEAR_ALL_RESULTS", results: [] });
    });
  }
};
