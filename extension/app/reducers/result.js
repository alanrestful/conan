export default (state = {}, action) => {
  switch (action.type) {
    case "PRODUCE_NEW_PAGE":
      return {
        ...state,
        page: action.result,
        action: null,
        result: null
      }
    case "PRODUCE_NEW_ACTION":
      return {
        ...state,
        action: action.result,
        page: null,
        result: null
      }
    case "SUCCESS_LOAD_RESULT":
      return {
        ...state,
        result: action.result,
        action: null,
        page: null
      }
    case "GET_ALL_RESULTS":
      return {
        ...state,
        results: action.results
      }
    case "CLEAR_ALL_RESULTS":
      return {
        ...state,
        results: action.results
      }
    default:
      return state;
  }
}
