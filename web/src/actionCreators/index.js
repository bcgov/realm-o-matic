import axios from 'axios';
import {
  getIdpsStart,
  getIdpsSuccess,
  getIdpsError,
  newRequestStart,
  newRequestSuccess,
  newRequestError,
} from '../actions';
import implicitAuthManager from '../utils/auth';
import { API } from '../constants/request';
import { generateRequestPayload } from '../utils/requestHelpers';

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
  headers: { Accept: 'application/json', Authorization: authorizationHeader() },
});

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
 * Start a new request record
 */
export const newRequest = requestInfo => {
  return async (dispatch, getState) => {
    dispatch(newRequestStart());

    try {
      const requestData = generateRequestPayload(requestInfo);
      const res = await axiSSO.post(API.NEW_REQUEST(requestData.realm.id), requestData);
      const newRequest = res.data;
      return dispatch(newRequestSuccess(newRequest));
    } catch (err) {
      const errMsg = `Fail to start the request: ${err}`;
      return dispatch(newRequestError(errMsg));
    }
  };
};
