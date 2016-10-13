export default (state = {}, action) => {
  switch (action.type) {
    case "SUCCESS_LOAD_CASES":
      return {
        ...state,
        cases: action.result
      }
    default:
      return state;
  }
}
