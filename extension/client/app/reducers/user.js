// import { SUCCESS_UPDATE_PWD } from 'actionTypes';

export default function(state={}, action) {

  switch (action.type) {
    case "SUCCESS_UPDATE_PWD":
      return Object.assign({}, state, {
        error: action.error,
        success: action.success,
        timestamp: new Date()
      });
    default:
      return state
  }

}
