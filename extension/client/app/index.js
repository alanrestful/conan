import React from "react";
import ReactThunk from "redux-thunk";
import ReactDOM from "react-dom";

import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import { Router, Route, History, IndexRoute, browserHistory } from "react-router";

import { noAuthToLogin, fetchUtil, actionCreator } from 'util';

import Index from "./components/index/index";
// import { LOGIN_USER } from 'actionTypes';

import reducers from "./reducers/reducers";

const AppRouter = () => {
  return (
    <Router history={browserHistory}>
      <Route path="/" component={Index} />
      <Route path="/index.html" component={Index} />
    </Router>
  );
};

const hasLogin = (nextState, replace, callback) => {
  let options = { url: '/api/user', history: replace }
  //store.dispatch(LoginAction.getLogined(replace))
  fetchUtil(options)
  .then(data => {
    store.dispatch(actionCreator(LOGIN_USER, {userInfo: data}));
    return data;
  })
  .then(user => {
    if(_.isEmpty(user)) {
      let url = nextState.location.pathname + nextState.location.search
      noAuthToLogin(url, replace)
    }
    callback();
  });
}

const store = createStore(reducers, applyMiddleware(ReactThunk));

ReactDOM.render((
  <Provider store={store} key='provider'>
    <AppRouter />
  </Provider>
), document.getElementById('app'));
