import React from "react";
import ReactDOM from "react-dom";
import ReactThunk from "redux-thunk";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { Router, Route, hashHistory } from "react-router";

import Index from "index/index";
import Playback from "playback/index";
import NoMatch from "no_match/index";

import reducers from "reducers";

const AppRouter = () => {
  return (
    <Router history={ hashHistory }>
      <Route path="/" component={ Index } />
      <Route path="/playback" component={ Playback } />
      <Route path="*" component={ NoMatch } />
    </Router>
  );
};

const store = createStore(reducers, applyMiddleware(ReactThunk));

ReactDOM.render((
  <Provider store={ store }>
    <AppRouter />
  </Provider>
), document.getElementById('app'));
