export default (state = {}, action) => {
  switch (action.type) {
    case "SUCCESS_LOAD_PAGES":
      return {
        ...state,
        pages: action.result
      }
    case "SET_ACTIVED_PAGE_INDEX":
      return {
        ...state,
        selectedPageIndex: action.result
      }
    case "PRODUCE_NEW_PAGE":
      return {
        ...state,
        page: action.result,
        action: null
      }
    case "PRODUCE_NEW_ACTION":
      return {
        ...state,
        action: action.result,
        page: null
      }
    case "DELETE_PAGE_BY_INDEX":
      return {
        ...state,
        action: action.result
      }
    case "DELETE_ALL_PAGES":
      return {
        ...state,
        pages: action.result
      }
    case "CHANGE_SELECTED_ACTIONS":
      return {
        ...state,
        selectedActions: action.result
      }
    default:
      return state;
  }
}
