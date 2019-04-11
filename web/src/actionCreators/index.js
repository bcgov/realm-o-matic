import axios from 'axios';
import { getIdpsStart, getIdpsSuccess, getIdpsError } from '../actions';
import implicitAuthManager from '../utils/auth';
import { API } from '../constants';

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
