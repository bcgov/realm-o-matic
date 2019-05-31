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
import jsonata from 'jsonata';
import { validateSchema, isMatch } from '../utils';
import { PR_SCHEMA, PR_CONTENT_SCHEMA } from '../../constants';

/**
 * Get data from json object by path:
 * @param {Object} jsonData the JSON object
 * @param {Array} paths the path or paths to the key
 */
export const jsonReader = (jsonData, paths = null) => {
  if (_.isEmpty(paths)) return jsonData;
  if (_.isString(paths)) {
    const value = jsonata(paths).evaluate(jsonData);
    return value;
  }
  if (_.isObject(paths)) {
    const { optionals, dataStructure } = paths;
    return _.mapValues(dataStructure, p => {
      const data = jsonata(p).evaluate(jsonData);
      if (data === undefined && !optionals.includes(p))
        throw Error(`Failed to read data with key: ${p}`);
      return data;
    });
  }
  throw Error(`Cannot process data for the path: ${paths}.`);
};

/**
 * Filter a list of PRs and validate the structure of data:
 * @param {Object} pr the pull request
 * @param {Array} labels to filter with
 * @param {String} userId to filter with
 * @returns resultPr
 */
export const prParser = (pr, labels = [], userId = null) => {
  let resultPr = null;
  // check if pr is valid:
  const { isValid, payload } = validateSchema(pr, PR_SCHEMA);

  if (isValid) {
    // Turn the PR labels attribute to an array, e.g.: ['x', 'x'] or [undefined]:
    const prArray = payload.labels;
    payload.labels = Array.isArray(prArray) ? prArray : [prArray];

    // filter by labels if specified, or no filter:
    if (isMatch(payload.labels, labels)) {
      // Avoid error for JSON.parse
      try {
        // check if pr content is valid, need to parse the content as it's string:
        const content = validateSchema(JSON.parse(payload.prContent), PR_CONTENT_SCHEMA);
        if (content.isValid) {
          // filter by user:
          resultPr = isMatch(content.payload.requester.id, userId)
            ? { ...payload, ...{ prContent: content.payload } }
            : null;
        }
      } catch (err) {
        // do nothing to filter out this item
      }
    }
  }
  return resultPr;
};
