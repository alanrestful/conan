export default (state={}, action) => {
  switch (action.type) {
    case "SUCCESS_LOAD_PAGES":
      return {
        ...state,
        pages: action.result
      }
    case "SET_ACTIVED_ACTIONS":
      return {
        ...state,
        selectedPage: action.result
      }
    case "PRODUCE_NEW_PAGE":
      return {
        ...state,
        page: action.result
      }
    case "PRODUCE_NEW_ACTION":
      return {
        ...state,
        action: action.result
      }
    default:
      return state
  }
}
