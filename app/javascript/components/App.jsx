import React, { Component } from 'react';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import { rootReducer } from '../reducers/index';
import ReduxThunk from "redux-thunk";
import { createLogger } from "redux-logger";

import Main from './MainComponent';

import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import 'react-image-lightbox/style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@trendmicro/react-sidenav/dist/react-sidenav.css';
import 'bootstrap-social/bootstrap-social.css';
import 'font-awesome/css/font-awesome.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import initialState from './constants/initialState';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const loggerMiddleware = createLogger();

const store = createStore(
  rootReducer,
  composeEnhancers(
      applyMiddleware(
          ReduxThunk,
          loggerMiddleware,
      )
  )
);

export default class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <Main />
          <ToastContainer closeOnClick autoClose={5000}/>
        </Provider>
    );
  }
}
