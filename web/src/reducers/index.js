import { combineReducers } from 'redux';
import implicitAuthManager from '../utils/auth';
import { AUTHENTICATION, GET_IDPS } from '../actions/actionTypes';

const authentication = (state = { isAuthenticated: false, email: null, userId: null }, action) => {
  switch (action.type) {
    case AUTHENTICATION.SUCCESS:
      return {
        ...state,
        ...{
          isAuthenticated: true,
          email: implicitAuthManager.idToken.data.email,
          userId: implicitAuthManager.idToken.data.sub,
        },
      };
    case AUTHENTICATION.FAILED:
      implicitAuthManager.clearAuthLocalStorage();
      return {
        isAuthenticated: false,
        email: null,
        userId: null,
      };
    default:
      return state;
  }
};

const getIdps = (state = { getIdpsStarted: false, idps: null, errorMessage: null }, action) => {
  switch (action.type) {
    case GET_IDPS.START:
      return {
        getIdpsStarted: true,
        idps: null,
        errorMessage: null,
      };
    case GET_IDPS.SUCCESS:
      return {
        getIdpsStarted: false,
        idps: action.payload.idps,
        errorMessage: null,
      };
    case GET_IDPS.ERROR:
      return {
        getIdpsStarted: false,
        idps: null,
        errorMessage: action.payload.errorMessage,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  authentication,
  getIdps,
});

export default rootReducer;
