import { AUTHENTICATION, GET_IDPS, GET_REQUESTS, NEW_REQUEST, AUTHORIZATION } from './actionTypes';

export const authenticateSuccess = () => {
  return {
    type: AUTHENTICATION.SUCCESS,
  };
};

export const authenticateFailed = () => {
  return {
    type: AUTHENTICATION.FAILED,
  };
};

export const getIdpsStart = () => {
  return {
    type: GET_IDPS.START,
  };
};

export const getIdpsSuccess = idps => {
  return {
    type: GET_IDPS.SUCCESS,
    payload: {
      idps,
    },
  };
};

export const getIdpsError = errorMessage => {
  return {
    type: GET_IDPS.ERROR,
    payload: {
      errorMessage,
    },
  };
};

export const newRequestStart = () => {
  return {
    type: NEW_REQUEST.START,
  };
};

export const newRequestSuccess = requestId => {
  return {
    type: NEW_REQUEST.SUCCESS,
    payload: {
      requestId,
    },
  };
};

export const newRequestError = errorMessage => {
  return {
    type: NEW_REQUEST.ERROR,
    payload: {
      errorMessage,
    },
  };
};

export const getRequestsStart = () => {
  return {
    type: GET_REQUESTS.START,
  };
};

export const getRequestsSuccess = requests => {
  return {
    type: GET_REQUESTS.SUCCESS,
    payload: {
      requests,
    },
  };
};

export const getRequestsError = errorMessage => {
  return {
    type: GET_REQUESTS.ERROR,
    payload: {
      errorMessage,
    },
  };
};

export const authorizationStart = () => {
  return {
    type: AUTHORIZATION.START,
  };
};

export const authorizationSuccess = authCode => {
  return {
    type: AUTHORIZATION.SUCCESS,
    payload: {
      authCode,
    },
  };
};

export const authorizationError = errorMessage => {
  return {
    type: AUTHORIZATION.ERROR,
    payload: {
      errorMessage,
    },
  };
};
