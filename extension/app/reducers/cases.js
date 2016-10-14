export default (state = {}, action) => {
  switch (action.type) {
    case "SUCCESS_CREATE_CASE":
      return {
        ...state,
        cases: action.result
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
