export default (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload.user,
        isLogin: action.payload.isLogin
      }
    case 'TOGGLE_LOGIN_MODAL':
      return {
        ...state,
        loginModalVisible: action.payload.loginModalVisible
      }
    case 'TOGGLE_PRICE_MODAL':
      return {
        ...state,
        priceModalVisible: action.payload.priceModalVisible
      }
    case 'SET_HISTORY':
      return {
        ...state,
        history: action.payload.history
      }
    case 'SET_PRODUCTS':
      return {
        ...state,
        products: action.payload.products
      }
    default:
      return state
  }
}