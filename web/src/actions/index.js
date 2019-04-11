import { AUTHENTICATION, GET_IDPS } from './actionTypes';

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
