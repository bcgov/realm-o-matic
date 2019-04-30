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
import { errorWithCode, logger } from '@bcgov/common-nodejs-utils';
import { realmSchema } from '../../constants';
import { validateSchema } from '../utils';

// Normalize the github issue:
export const normalizeIssue = issueBody => {
  try {
    const issueContent = issueBody.body;
    const issueId = issueBody.number;
    if (!issueContent || !issueId) throw Error('Invalid GitHub issue.');
    const realmInfo = JSON.parse(issueContent.replace(/\r?\n|\r/g, ''));
    const { isValid, payload } = validateSchema(realmInfo, realmSchema);

    if (!isValid) throw Error(payload);
    return { issueId, realm: payload };
  } catch (err) {
    throw Error(err);
  }
};

// Get the array of normalize github issues:
export const normalizeIssues = data => {
  try {
    if (!_.isEmpty(data)) {
      return _.isArray(data) ? data.map(i => normalizeIssue(i)) : [normalizeIssue(data)];
    }
    throw errorWithCode('No issues found.', 404);
  } catch (err) {
    logger.error(`Fail to normalize issue: ${err.message}`);
    throw err;
  }
};

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
    return _.mapValues(paths, p => {
      const data = jsonata(p).evaluate(jsonData);
      if (data === undefined) throw Error(`Failed to read the data with ${p}`);
      return data;
    });
  }
  throw Error('Cannot process this request data.');
};
