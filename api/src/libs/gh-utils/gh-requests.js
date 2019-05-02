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
import { GITHUB_REQUEST, GITHUB_JSON_PATH } from '../../constants';
import shared from '../shared';
import config from '../../config';
import { jsonReader } from './gh-helpers';

/**
 * Create GitHub client with repo properties:
 * @param {Function} ghFn Octokit function
 * @param {Object} ghFnParams extra parameters for the GitHub function
 * @param {Object} resultQuery query expressions for the respose object
 */
export const ghHelper = async (ghFn, ghFnParams, resultQuery) => {
  try {
    const res = await ghFn({
      owner: config.get('github:owner'),
      repo: config.get('github:repo'),
      ...ghFnParams,
    });

    const { data } = res;
    if (!data) throw Error('No data returned with the request.');
    return _.isArray(data)
      ? data.map(i => jsonReader(i, resultQuery))
      : jsonReader(data, resultQuery);
  } catch (err) {
    throw err;
  }
};

/**
 * Request to get a branch by name:
 * @param {String} branchName name of branch
 */
export const getBranch = branchName =>
  ghHelper(shared.gh.repos.getBranch, { branch: branchName }, 'commit.sha');

/**
 * Request to create a branch by name:
 * @param {String} branchName name of branch
 * @param {String} base sha of base commit
 */
export const createBranch = (branchName, base) =>
  ghHelper(
    shared.gh.git.createRef,
    { ref: GITHUB_REQUEST.branchRef(branchName), sha: base },
    'ref'
  );

/**
 * Request to create and push file:
 * @param {String} branchName name of branch
 * @param {Object} file file object
 */
export const createFile = (file, branchName) =>
  ghHelper(
    shared.gh.repos.createFile,
    {
      path: GITHUB_REQUEST.recordPath(file.name),
      message: GITHUB_REQUEST.commitMessage(file.name),
      content: file.content,
      branch: branchName,
    },
    'content.name'
  );

/**
 * Request to create pull request:
 * @param {String} branchName name of branch
 * @param {String} fileName name of file
 */
export const createPR = (fileName, branchName, user) =>
  ghHelper(
    shared.gh.pulls.create,
    { title: fileName, head: branchName, base: GITHUB_REQUEST.BASE_BRANCH, body: user },
    GITHUB_JSON_PATH.PR_PATH
  );

/**
 * Request to get all OPEN pull requests:
 * @param {Object} filters filter by the state
 */
export const getPRs = filters => ghHelper(shared.gh.pulls.list, filters, GITHUB_JSON_PATH.PR_PATH);
