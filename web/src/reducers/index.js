import { combineReducers } from 'redux';
import implicitAuthManager from '../utils/auth';
import {
  AUTHENTICATION,
  GET_IDPS,
  GET_REQUESTS,
  NEW_REQUEST,
} from '../actions/actionTypes';

const authentication = (state = { isAuthenticated: false, userInfo: {}, userId: null }, action) => {
  switch (action.type) {
    case AUTHENTICATION.SUCCESS:
      return {
        ...state,
        ...{
          isAuthenticated: true,
          userId: implicitAuthManager.idToken.data.sub,
          userInfo: {
            username: implicitAuthManager.idToken.data.preferred_username,
            email: implicitAuthManager.idToken.data.email,
            lName: implicitAuthManager.idToken.data.family_name,
            fName: implicitAuthManager.idToken.data.given_name,
            roles: implicitAuthManager.idToken.data.roles,
          },
        },
      };
    case AUTHENTICATION.FAILED:
      implicitAuthManager.clearAuthLocalStorage();
      return {
        isAuthenticated: false,
        userInfo: {},
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

const getRequests = (
  state = { getRequestsStarted: false, requests: null, errorMessage: null },
  action
) => {
  switch (action.type) {
    case GET_REQUESTS.START:
      return {
        getRequestsStarted: true,
        requests: null,
        errorMessage: null,
      };
    case GET_REQUESTS.SUCCESS:
      return {
        getRequestsStarted: false,
        requests: action.payload.requests,
        errorMessage: null,
      };
    case GET_REQUESTS.ERROR:
      return {
        getRequestsStarted: false,
        requests: null,
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
  getRequests,
  newRequest,
});

export default rootReducer;
