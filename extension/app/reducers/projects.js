export default (state = {}, action) => {
  switch (action.type) {
    case "SUCCESS_INIT_CONNECT":
      return {
        ...state,
        init: action.result
      }
    case "SUCCESS_GET_PROJECTS":
      return {
        ...state,
        projects: action.result
      }
    case "GET_PROJECT_INFO":
      return {
        ...state,
        project: action.result
      }
    default:
      return state;
  }
}
