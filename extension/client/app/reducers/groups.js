export default (state = {}, action) => {
  switch (action.type) {
    case "SUCCESS_LOAD_GROUPS":
      return {
        ...state,
        groups: action.result
      }
    default:
      return state;
  }
}
