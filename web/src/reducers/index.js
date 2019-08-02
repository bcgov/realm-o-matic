import { combineReducers } from 'redux';
import implicitAuthManager from '../utils/auth';
import {
  AUTHENTICATION,
  GET_IDPS,
  GET_REQUESTS,
  NEW_REQUEST,
  AUTHORIZATION,
  GET_RECORD,
  APPROVE_REQUEST,
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

const authorization = (
  state = { authorizationStarted: false, authCode: null, errorMessage: null },
  action
) => {
  switch (action.type) {
    case AUTHORIZATION.START:
      return {
        authorizationStarted: true,
        authCode: null,
        errorMessage: null,
      };
    case AUTHORIZATION.SUCCESS:
      return {
        authorizationStarted: false,
        authCode: action.payload.authCode,
        errorMessage: null,
      };
    case AUTHORIZATION.ERROR:
      return {
        authorizationStarted: false,
        authCode: null,
        errorMessage: action.payload.errorMessage,
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

const getRecord = (
  state = { getRecordStarted: false, recordInfo: null, errorMessage: null },
  action
) => {
  switch (action.type) {
    case GET_RECORD.START:
      return {
        getRecordStarted: true,
        recordInfo: null,
        errorMessage: null,
      };
    case GET_RECORD.SUCCESS:
      return {
        getRecordStarted: false,
        recordInfo: action.payload.recordInfo,
        errorMessage: null,
      };
    case GET_RECORD.ERROR:
      return {
        getRecordStarted: false,
        recordInfo: null,
        errorMessage: action.payload.errorMessage,
      };
    default:
      return state;
  }
};

const approveRequest = (
  state = { approveRequestStarted: false, approveRequestCompleted: false, errorMessage: null },
  action
) => {
  switch (action.type) {
    case APPROVE_REQUEST.START:
      return {
        approveRequestStarted: true,
        approveRequestCompleted: false,
        errorMessage: null,
      };
    case APPROVE_REQUEST.SUCCESS:
      return {
        approveRequestStarted: false,
        approveRequestCompleted: true,
        errorMessage: null,
      };
    case APPROVE_REQUEST.ERROR:
      return {
        approveRequestStarted: false,
        approveRequestCompleted: false,
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
  authorization,
  getRecord,
  approveRequest,
});

export default rootReducer;
