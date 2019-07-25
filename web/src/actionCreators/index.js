import axios from 'axios';
import {
  getIdpsActionSet,
  authorizationActionSet,
  getRequestsActionSet,
  newRequestActionSet,
  getRecordActionSet,
  approveRequestActionSet,
} from '../actions';
import implicitAuthManager from '../utils/auth';
import { API } from '../constants/request';
import { generateRequestPayload } from '../utils/requestHelpers';
import { ACCESS_CONTROL } from '../constants/auth';

/**
 * Setup SSO Axios request
 */
const axiSSO = axios.create({
  baseURL: API.BASE_URL(),
  timeout: API.TIME_OUT,
});

// Dynamically set the header:
axiSSO.interceptors.request.use(
  config => {
    const token = implicitAuthManager.idToken.bearer;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

/**
 * Get user authorization status
 */
export const authorizationAction = (id, roles = []) => {
  return async (dispatch, getState) => {
    dispatch(authorizationActionSet.start());

    try {
      const res = await axiSSO.get(API.AUTHORIZATION(id), {
        params: {
          roles: JSON.stringify(roles),
        },
      });
      const authorizationCode = res.data;
      return dispatch(authorizationActionSet.success({ authCode: authorizationCode }));
    } catch (err) {
      // authmware in api throws 401 for no role user:
      if (err.response.status === 401)
        return dispatch(authorizationActionSet.success(ACCESS_CONTROL.NO_ROLE));
      const errorMessage = `Fail to authorize: ${err}, please refresh page.`;
      return dispatch(authorizationActionSet.error({ errorMessage }));
    }
  };
};

/**
 * Get list of idps avaible
 */
export const getIdps = () => {
  return async (dispatch, getState) => {
    dispatch(getIdpsActionSet.start());
    try {
      const res = await axiSSO.get(API.IDP());
      const idps = res.data.idp;
      return dispatch(getIdpsActionSet.success({ idps }));
    } catch (err) {
      const errorMessage = `Fail to get IDPs as ${err}`;
      return dispatch(getIdpsActionSet.error({ errorMessage }));
    }
  };
};

/**
 * Get list of request records
 */
export const getRequestsAction = filters => {
  return async (dispatch, getState) => {
    dispatch(getRequestsActionSet.start());

    try {
      const res = await axiSSO.get(API.REQUESTS(), {
        params: filters,
      });

      const requests = res.data;
      return dispatch(getRequestsActionSet.success({ requests }));
    } catch (err) {
      const errorMessage = `Fail to get requests: ${err}`;
      return dispatch(getRequestsActionSet.error({ errorMessage }));
    }
  };
};

/**
 * Start a new request record
 */
export const newRequest = requestInfo => {
  return async (dispatch, getState) => {
    dispatch(newRequestActionSet.start());

    try {
      const requestData = generateRequestPayload(requestInfo);
      const res = await axiSSO.post(API.NEW_REQUEST(requestData.id), {
        request: requestData,
      });
      const newRequest = res.data;
      return dispatch(newRequestActionSet.success({ requestId: newRequest }));
    } catch (err) {
      const errorMessage = `Fail to start the request: ${err}`;
      return dispatch(newRequestActionSet.error({ errorMessage }));
    }
  };
};

/**
 * Get details of a record
 */
export const getRecordAction = number => {
  return async (dispatch, getState) => {
    dispatch(getRecordActionSet.start());

    try {
      const res = await axiSSO.get(API.REQUESTS(number));
      const record = res.data;
      return dispatch(getRecordActionSet.success({ recordInfo: record }));
    } catch (err) {
      const errorMessage = `Fail to fetch the record: ${err}`;
      return dispatch(getRecordActionSet.error({ errorMessage }));
    }
  };
};

/**
 * Set the approval status of a request
 */
export const approveRequestAction = (number, isApproved, message = null) => {
  return async (dispatch, getState) => {
    dispatch(approveRequestActionSet.start());

    try {
      await axiSSO.post(API.APPROVE_REQUEST(number), {
        approvalConten: {
          isApproved,
          message,
        },
      });

      return dispatch(approveRequestActionSet.success());
    } catch (err) {
      const errorMessage = `Fail to set request approval status: ${err}`;
      return dispatch(approveRequestActionSet.error({ errorMessage }));
    }
  };
};
