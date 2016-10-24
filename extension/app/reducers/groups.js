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
    case "SUCCESS_EDIT_MODEL":
      return {
        ...state,
        models: action.result
      }
    case "SUCCESS_DELETE_MODEL":
      return {
        ...state,
        models: action.result
      }
    case "SET_CHECKED_IDS":
      return {
        ...state,
        checkedIds: action.result
      }
    case "SUCCESS_CREATE_CASE":
      return {
        ...state,
        ...action.result
      }
    case "SUCCESS_LOAD_CASES":
      return {
        ...state,
        ...action.result
      }
    default:
      return state;
  }
}
