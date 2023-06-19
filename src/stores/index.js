import thunkMiddleware from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'

export const initialState = {
  user: null,
  history: null,
  products: [],
  loginModalVisible: false,
  priceModalVisible: false,
  isLogin: false,
  isVip: false,
  isExpired: false,
  privileges: []
}

export const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(thunkMiddleware)
)