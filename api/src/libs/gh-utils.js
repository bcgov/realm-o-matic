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
import { errorWithCode } from '@bcgov/nodejs-common-utils';
import { realmSchema } from '../constants';
import { validateSchema } from './utils';
import shared from './shared';
import config from '../config';

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
    throw Error(err.message);
  }
};

// Request to get list of open GitHub issues:
export const getIssueList = async () => {
  try {
    const res = await shared.gh.issues.listForRepo({
      owner: config.get('github:owner'),
      repo: config.get('github:repo'),
    });

    const openIssues = normalizeIssues(res.data);

    return openIssues;
  } catch (err) {
    throw err;
  }
};

// Request to find a GitHub issue:
export const getIssue = async issueId => {
  try {
    const res = await shared.gh.issues.get({
      owner: config.get('github:owner'),
      repo: config.get('github:repo'),
      issue_number: issueId,
    });
    const openIssue = normalizeIssues(res.data);

    return openIssue;
  } catch (err) {
    throw err;
  }
};
