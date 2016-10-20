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
    case "DELETE_PAGE_BY_INDEX":
      return {
        ...state,
        pages: action.result
      }
    case "DELETE_ALL_PAGES":
      return {
        ...state,
        pages: action.result
      }
    case "CHANGE_SELECTED_ACTIONS":
      return {
        ...state,
        selectedActionIndexs: action.result
      }
    default:
      return state;
  }
}
