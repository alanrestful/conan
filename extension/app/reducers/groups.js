export default (state = {}, action) => {
  switch (action.type) {
    case "SUCCESS_LOAD_ALL_DATAS":
      return {
        ...state,
        groups: action.result
      }
    case "SUCCESS_LOAD_GROUPS":
      return {
        ...state,
        groups: action.result
      }
    case "SUCCESS_DELETE_GROUP":
      return {
        ...state,
        cases: action.result
      }
    case "SUCCESS_LOAD_MODELS":
      return {
        ...state,
        ...action.result
      }
    case "GET_PLAY_SETTING":
      return {
        ...state,
        playSetting: action.result
      }
    case "SET_PLAY_SETTING":
      return {
        ...state,
        playSetting: action.result
      }
    default:
      return state;
  }
}
