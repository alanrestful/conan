export default (state = {}, action) => {
  switch (action.type) {
    case "SUCCESS_LOAD_PAGES":
      return {
        ...state,
        pages: action.result
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
    default:
      return state;
  }
}
