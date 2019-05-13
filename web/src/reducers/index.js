import { combineReducers } from 'redux';
import implicitAuthManager from '../utils/auth';
import { AUTHENTICATION, GET_IDPS, NEW_REQUEST } from '../actions/actionTypes';

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

const newRequest = (
  state = { newRequestStarted: false, requestId: null, errorMessage: null },
  action
) => {
  switch (action.type) {
    case NEW_REQUEST.START:
      return {
        newRequestStarted: true,
        requestId: null,
        errorMessage: null,
      };
    case NEW_REQUEST.SUCCESS:
      return {
        newRequestStarted: false,
        requestId: action.payload.requestId,
        errorMessage: null,
      };
    case NEW_REQUEST.ERROR:
      return {
        newRequestStarted: false,
        requestId: null,
        errorMessage: action.payload.errorMessage,
      };
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  authentication,
  getIdps,
  newRequest,
});

export default rootReducer;
