import _ from 'lodash';
import uuidv4 from 'uuid/v4';
import { formDataToRequest, requestToFormData } from '../constants/form';

/**
 * Generate random string with fix length
 * @param {number} length length of string
 */
export const randomRealmId = length => {
  const lstChar = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let string = '';

  for (var i = 0; i < length; i++) {
    let rnd = Math.floor(lstChar.length * Math.random());
    string += lstChar.charAt(rnd);
  }
  return string;
};

/**
 * Flatten an object with paths for keys
 * https://bit.ly/2neWfJ2
 * @param {Object} inputData the object to be flattened
 * @param {String} prefix prefix for all key path, default as none
 * @returns {Object} nested object to be flat object with key like 'key1.key2.key3'
 */
export const flattenObject = (inputData, prefix = '') =>
  Object.keys(inputData).reduce((result, k) => {
    // setup key path:
    const pre = prefix.length ? prefix + '.' : '';
    // if the current item is an object (but not an array or null), then loop through:
    if (typeof inputData[k] === 'object' && !Array.isArray(inputData[k]) && inputData[k])
      Object.assign(result, flattenObject(inputData[k], pre + k));
    // else, combine key path:
    else result[pre + k] = inputData[k];
    return result;
  }, {});

/**
 * Normalize the data between request and form input
 * @param {Object} inputData data to be matched for schema
 * @param {Object} schema data schema
 */
export const normalizeData = (inputData, schema) => {
  if (inputData && schema) {
    return _.mapValues(schema, p => {
      if (_.isObject(p)) return normalizeData(inputData, p);
      else {
        const data = inputData[p];
        return data ? data : null;
      }
    });
  }
  throw Error('Not able to process input data.');
};

/**
 * Generate unique request payload
 * @param {Object} requestInfo the raw data from form input
 */
export const generateRequestPayload = requestInfo => {
  // Add a uuid for the request to make unique:
  const id = uuidv4();
  const uniqueRequest = { id, ...requestInfo };
  return normalizeData(uniqueRequest, formDataToRequest);
};
