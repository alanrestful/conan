import { combineReducers } from "redux";

import actions from './actions';
import projects from './projects';
import groups from './groups';
import cases from './cases';

export default combineReducers({
  actions,
  projects,
  groups,
  cases
});
