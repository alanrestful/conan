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
      console.log(action.result)
      return {
        ...state,
        models: action.result
      }
    case "SUCCESS_CHECKED_MODELS":
      return {
        ...state,
        checkedModelIndexs: action.result
      }
    case "SUCCESS_CREATE_CASE":
      console.log(action.result)
      return {
        ...state,
        ...action.result
      }
    case "SUCCESS_LOAD_CASES":
      return {
        ...state,
        cases: action.result
      }
    default:
      return state;
  }
}
