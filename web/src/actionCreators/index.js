import axios from 'axios';
import {
  getIdpsStart,
  getIdpsSuccess,
  getIdpsError,
  authorizationStart,
  authorizationSuccess,
  authorizationError,
  getRequestsStart,
  getRequestsSuccess,
  getRequestsError,
  newRequestStart,
  newRequestSuccess,
  newRequestError,
  getRecordStart,
  getRecordSuccess,
  getRecordError,
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
    dispatch(authorizationStart());

    try {
      const res = await axiSSO.get(API.AUTHORIZATION(id), {
        params: {
          roles: JSON.stringify(roles),
        },
      });
      const authorizationCode = res.data;
      return dispatch(authorizationSuccess(authorizationCode));
    } catch (err) {
      // authmware in api throws 401 for no role user:
      if (err.response.status === 401)
        return dispatch(authorizationSuccess(ACCESS_CONTROL.NO_ROLE));
      const errMsg = `Fail to authorize: ${err}, please refresh page.`;
      return dispatch(authorizationError(errMsg));
    }
  };
};

/**
 * Get list of idps avaible
 */
export const getIdps = () => {
  return async (dispatch, getState) => {
    dispatch(getIdpsStart());
    try {
      const res = await axiSSO.get(API.IDP());
      const idps = res.data.idp;
      return dispatch(getIdpsSuccess(idps));
    } catch (err) {
      const errMsg = `Fail to get IDPs as ${err}`;
      return dispatch(getIdpsError(errMsg));
    }
  };
};

/**
 * Get list of request records
 */
export const getRequestsAction = filters => {
  return async (dispatch, getState) => {
    dispatch(getRequestsStart());

    try {
      const res = await axiSSO.get(API.REQUESTS(), {
        params: filters,
      });

      const requests = res.data;
      return dispatch(getRequestsSuccess(requests));
    } catch (err) {
      const errMsg = `Fail to get requests: ${err}`;
      return dispatch(getRequestsError(errMsg));
    }
  };
};

/**
 * Start a new request record
 */
export const newRequest = requestInfo => {
  return async (dispatch, getState) => {
    dispatch(newRequestStart());

    try {
      const requestData = generateRequestPayload(requestInfo);
      const res = await axiSSO.post(API.NEW_REQUEST(requestData.id), {
        request: requestData,
      });
      const newRequest = res.data;
      return dispatch(newRequestSuccess(newRequest));
    } catch (err) {
      const errMsg = `Fail to start the request: ${err}`;
      return dispatch(newRequestError(errMsg));
    }
  };
};

/**
 * Get details of a record
 */
export const getRecordAction = number => {
  return async (dispatch, getState) => {
    dispatch(getRecordStart());

    try {
      const res = await axiSSO.get(API.REQUESTS(number));
      const record = res.data.prContent;
      return dispatch(getRecordSuccess(record));
    } catch (err) {
      const errMsg = `Fail to fetch the record: ${err}`;
      return dispatch(getRecordError(errMsg));
    }
  };
};
