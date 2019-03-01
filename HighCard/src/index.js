import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app';

//import { Provider } from 'react-redux';
// import { createStore, applyMiddleware, compose} from 'redux';
// import rootReducer from './reducers/index';
// import thunkMiddleware from 'redux-thunk';
import registerServiceWorker from './registerServiceWorker';

/**
 * Function to apply and custom or third part middleware and enhancers.
 * Middleware is used to apply modifications to actions returned by action-creators
 * Enhancers are decorators functions that wrap calls to reducers
 * @param preloadedState
 * @return {Store<any> & *}
 */
// function configureStore(preloadedState) {
//   const middleware = [thunkMiddleware];
//   const middlewareEnhancer = applyMiddleware(...middleware);
//   const enhancers = [middlewareEnhancer];
//   const composedEnhancers = compose(...enhancers);
//
//   return createStore(rootReducer, preloadedState, composedEnhancers);
// }

// call our store creator
// const store = configureStore();

// render the app wrapped with the store provider
ReactDOM.render((
  <App/>
), document.getElementById('root'));
registerServiceWorker();
