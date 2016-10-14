export default (state = {}, action) => {
  switch (action.type) {
    case "SUCCESS_GET_PROJECTS":
      return {
        ...state,
        projects: action.result
      }
    case "SET_PROJECT_INFO":
      return {
        ...state,
        project: action.result
      }
    default:
      return state;
  }
}
