import uuidv4 from 'uuid/v4';

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
 * Generate unique request payload
 * @param {Object} requestInfo the raw data from form input
 */
export const generateRequestPayload = requestInfo => {
  // Add a uuid for the request to make unique:
  const id = uuidv4();
  return { id, ...requestInfo };
};
