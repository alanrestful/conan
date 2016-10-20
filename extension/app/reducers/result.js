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
    default:
      return state;
  }
}
