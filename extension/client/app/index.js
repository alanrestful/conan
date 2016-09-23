import React from "react";
import ReactThunk from "redux-thunk";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { Router, Route, browserHistory, hashHistory } from "react-router";

import { noAuthToLogin, fetchUtil, actionCreator } from 'util';

import Index from "./components/index/index";
import Playback from "./components/playback/index";

import reducers from "./reducers/reducers";

const AppRouter = () => {
  return (
    <Router history={ browserHistory }>
      <Route path="/" component={ Index } />
      <Route path="/playback" component={ Playback } />
    </Router>
  );
};

const store = createStore(reducers, applyMiddleware(ReactThunk));

ReactDOM.render((
  <Provider store={ store }>
    <AppRouter />
  </Provider>
), document.getElementById('app'));
