import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import logger from 'redux-logger';

import keplerGlReducer from 'kepler.gl/reducers';
import { enhanceReduxMiddleware } from 'kepler.gl/middleware';

const initialState = {};

const reducers = combineReducers({
  keplerGl: keplerGlReducer,
  // app: appReducer,
});

const middlewares = enhanceReduxMiddleware([logger]);
const enhancers = [applyMiddleware(...middlewares)];

const store = createStore(reducers, initialState, compose(...enhancers));

export default store;
