export default (state = {}, action) => {
  switch (action.type) {
    case "SUCCESS_LOAD_GROUPS":
      return {
        ...state,
        groups: action.result
      }
    case "SUCCESS_DELETE_GROUP":
      return {
        ...state,
        groups: action.result
      }
    case "SUCCESS_LOAD_MODELS":
      return {
        ...state,
        ...action.result
      }
    case "SUCCESS_CHECKED_MODELS":
      return {
        ...state,
        checkedModelIndexs: { ...action.result }
      }
    default:
      return state;
  }
}
