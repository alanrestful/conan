import { combineReducers } from "redux";

import actions from './actions';
import projects from './projects';
import groups from './groups';

export default combineReducers({
  actions,
  projects,
  groups
});
