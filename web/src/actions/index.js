import { AUTHENTICATION, GET_IDPS, NEW_REQUEST } from './actionTypes';

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
