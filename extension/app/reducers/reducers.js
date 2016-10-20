import { combineReducers } from "redux";

import actions from './actions';
import result from './result';
import projects from './projects';
import groups from './groups';

export default combineReducers({
  actions,
  result,
  projects,
  groups
});
