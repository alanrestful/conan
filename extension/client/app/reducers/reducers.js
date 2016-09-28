import { combineReducers } from "redux";

import actions from './actions';
import projects from './projects';

export default combineReducers({
  actions,
  projects
});
