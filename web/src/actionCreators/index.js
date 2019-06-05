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
import { requestToFormData } from '../constants/form';
import { generateRequestPayload, flattenObject, normalizeData } from '../utils/requestHelpers';
import { ACCESS_CONTROL } from '../constants/auth';

/**
 * Set Authorization Header
 */
const authorizationHeader = () => {
  try {
    return `Bearer ${implicitAuthManager.idToken.bearer}`;
  } catch (err) {
    // throw Error('No JWT for authentication.');
    console.log('No JWT for authentication.');
  }
  return null;
};

/**
 * Setup SSO Axios request
 */
const axiSSO = axios.create({
  baseURL: API.BASE_URL(),
  timeout: API.TIME_OUT,
  // TODO: cannot preset authorizatino token in the header
  // headers: { Accept: 'application/json', Authorization: `Bearer ${implicitAuthManager.idToken ? implicitAuthManager.idToken.bearer : null}` },
});

/**
 * Get user authorization status
 */
export const authorizationAction = (id, roles = []) => {
  return async (dispatch, getState) => {
    dispatch(authorizationStart());

    try {
      const res = await axiSSO.get(API.AUTHORIZATION(id), {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${
            implicitAuthManager.idToken ? implicitAuthManager.idToken.bearer : null
          }`,
        },
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
      const res = await axiSSO.get(API.IDP(), {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${
            implicitAuthManager.idToken ? implicitAuthManager.idToken.bearer : null
          }`,
        },
      });
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
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${
            implicitAuthManager.idToken ? implicitAuthManager.idToken.bearer : null
          }`,
        },
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
      const res = await axiSSO.post(API.NEW_REQUEST(requestData.realm.id), {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${
            implicitAuthManager.idToken ? implicitAuthManager.idToken.bearer : null
          }`,
        },
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
      const res = await axiSSO.get(API.REQUESTS(number), {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${
            implicitAuthManager.idToken ? implicitAuthManager.idToken.bearer : null
          }`,
        },
      });
      const record = res.data.prContent;
      // Transform the data:
      const flattenRecord = flattenObject(record);
      const normalizaedReocrd = normalizeData(flattenRecord, requestToFormData);
      return dispatch(getRecordSuccess(normalizaedReocrd));
    } catch (err) {
      const errMsg = `Fail to fetch the record: ${err}`;
      return dispatch(getRecordError(errMsg));
    }
  };
};
