import _ from 'lodash';
import jsonata from 'jsonata';
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
 * Normalize the data between request and form input
 * @param {Object} inputData data to be matched for schema
 * @param {Object} schema data schema
 */
export const normalizeData = (inputData, schema) => {
  if (inputData && schema) {
    return _.mapValues(schema, p => {
      if (_.isObject(p)) return normalizeData(inputData, p);
      else {
        const data = jsonata(p).evaluate(inputData);
        if (data === undefined) throw Error(`Failed to read data with key: ${p}`);
        return data;
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
