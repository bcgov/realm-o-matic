import {
  AUTHENTICATION,
  GET_IDPS,
  GET_REQUESTS,
  NEW_REQUEST,
  AUTHORIZATION,
  GET_RECORD,
} from './actionTypes';

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

/**
 * Generate stander action sets
 * @param {Object} actionType with START, SUCCESS, and ERROR
 */
export const standardActionSetWrapper = actionType => {
  return {
    start: () => {
      return { type: actionType.START };
    },
    success: payload => {
      return {
        type: actionType.SUCCESS,
        payload,
      };
    },
    error: payload => {
      return {
        type: actionType.ERROR,
        payload,
      };
    },
  };
};

export const getRequestsActionSet = standardActionSetWrapper(GET_REQUESTS);
export const authorizationActionSet = standardActionSetWrapper(AUTHORIZATION);
export const getIdpsActionSet = standardActionSetWrapper(GET_IDPS);
export const getRecordActionSet = standardActionSetWrapper(GET_RECORD);
export const newRequestActionSet = standardActionSetWrapper(NEW_REQUEST);
export const approveRequestActionSet = standardActionSetWrapper(APPROVE_REQUEST);
