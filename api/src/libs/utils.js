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

import Ajv from 'ajv';

/**
 * Validate json object:
 * @param {Object} object the content to validate
 * @param {String} schema the schema to match against
 * @returns {Object} validation result and content/error message
 */
export const validateSchema = (object, schema) => {
  const ajv = new Ajv();
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
