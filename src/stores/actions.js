import http from '../http'

export const setUser = (user) => {
  return {
    type: 'SET_USER',
    payload: {
      user,
      isLogin: !!user?.email,
      isVip: user?.plan?.type !== 'FREE'
    }
  }
}

export const toggleLoginModal = (loginModalVisible) => {
  return {
    type: 'TOGGLE_LOGIN_MODAL',
    payload: {
      loginModalVisible
    }
  }
}

export const togglePriceModal = (priceModalVisible) => {
  return {
    type: 'TOGGLE_PRICE_MODAL',
    payload: {
      priceModalVisible
    }
  }
}

export const fetchUser = () => {
  return async (dispatch) => {
    const data = await http.get('/api/user/current')
    dispatch(setUser(data))
  }
}

export const fetchHistory = () => {
  return async (dispatch) => {
    const data = await http.get('/api/index/list')
    dispatch({
      type: 'SET_HISTORY',
      payload: {
        history: data
      }
    })
  }
}

export const fetchProducts = () => {
  return async (dispatch) => {
    const data = await http.get('/api/pricing/list')
    dispatch({
      type: 'SET_PRODUCTS',
      payload: {
        products: data
      }
    })
  }
}