//
// Realm-o-Matic
//
// Copyright © 2019 Province of British Columbia
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// Created by Shelly Xue Han
//

'use strict';

import _ from 'lodash';
import Ajv from 'ajv';

const ajv = new Ajv();

/**
 * Validate json object:
 * @param {Object} object the content to validate
 * @param {String} schema the schema to match against
 * @returns {Object} validation result and content/error message
 */
export const validateSchema = (object, schema) => {
  const validate = ajv.compile(schema);
  const isValid = validate(object);
  return {
    isValid,
    payload: isValid ? object : `Fail to match schema, ${ajv.errorsText(validate.errors)}`,
  };
};

/**
 * Base64 encode json to an object with name and content:
 * @param {String} name the name of the encoded content
 * @param {Object} content the content to be encoded
 */
export const encodeObjectWithName = (name, content) => {
  try {
    if (!name) throw Error('Missing name for object to encode');
    const encodedFileContent = Buffer.from(JSON.stringify(content)).toString('base64');
    return {
      name,
      content: encodedFileContent,
    };
  } catch (err) {
    throw err.message;
  }
};

/**
 * Match the input and target:
 * @param {object} input the input object
 * @param {object} target the target to match
 */
export const isMatch = (input, target) => {
  if (_.isEmpty(target)) return true;
  if (_.isArray(target)) {
    const arrayInput = _.isArray(input) ? input : [input];
    const matches = _.intersection(arrayInput, target);
    return !_.isEmpty(matches);
  }
  return input === target;
};

/**
 * Flatten an object with paths for keys
 * https://bit.ly/2neWfJ2
 * @param {Object} inputData the object to be flattened
 * @param {String} prefix prefix for all key path, default as none
 * @returns {Object} nested object to be flat object with key like 'key1.key2.key3'
 */
export const flattenObject = (inputData, prefix = '') =>
  Object.keys(inputData).reduce((output, k) => {
    const result = output;
    // setup key path:
    const pre = prefix.length ? `${prefix}.` : '';
    // if the current item is an object (but not an array or null), then loop through:
    if (typeof inputData[k] === 'object' && !Array.isArray(inputData[k]) && inputData[k])
      Object.assign(result, flattenObject(inputData[k], pre + k));
    // else, combine key path:
    else result[pre + k] = inputData[k];
    return result;
  }, {});

/**
 * Normalize the data between request and form data
 * @param {Object} inputData data to be matched for schema
 * @param {Object} schema data schema
 */
export const normalizeData = (inputData, schema) => {
  if (inputData && schema) {
    return _.mapValues(schema, p => {
      if (_.isObject(p)) return normalizeData(inputData, p);
      const data = inputData[p];
      return data || null;
    });
  }
  throw Error('Not able to process input data.');
};
