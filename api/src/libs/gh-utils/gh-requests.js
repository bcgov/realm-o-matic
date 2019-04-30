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
 * @param {Object} input extra properties
 * @param {Object} outPaths paths to the respose object
 */
export const ghClient = async (ghFn, input, outPaths) => {
  try {
    const res = await ghFn({
      owner: config.get('github:owner'),
      repo: config.get('github:repo'),
      ...input,
    });

    const { data } = res;
    if (!data) throw Error('No data returned with the request.');
    return _.isArray(data) ? data.map(i => jsonReader(i, outPaths)) : jsonReader(data, outPaths);
  } catch (err) {
    throw err;
  }
};

/**
 * Request to get a branch by name:
 * @param {String} bName name of branch
 */
export const getBranch = bName =>
  ghClient(shared.gh.repos.getBranch, { branch: bName }, 'commit.sha');

/**
 * Request to create a branch by name:
 * @param {String} bName name of branch
 * @param {String} base sha of base commit
 */
export const createBranch = (bName, base) =>
  ghClient(shared.gh.git.createRef, { ref: GITHUB_REQUEST.branchRef(bName), sha: base }, 'ref');

/**
 * Request to create and push file:
 * @param {String} bName name of branch
 * @param {Object} file file object
 */
export const createFile = (file, bName) =>
  ghClient(
    shared.gh.repos.createFile,
    {
      path: GITHUB_REQUEST.recordPath(file.name),
      message: GITHUB_REQUEST.commitMessage(file.name),
      content: file.content,
      branch: bName,
    },
    'content.name'
  );

/**
 * Request to create pull request:
 * @param {String} bName name of branch
 * @param {String} fileName name of file
 */
export const createPR = (fileName, bName, user) =>
  ghClient(
    shared.gh.pulls.create,
    { title: fileName, head: bName, base: GITHUB_REQUEST.BASE_BRANCH, body: user },
    GITHUB_JSON_PATH.PR_PATH
  );

/**
 * Request to get all OPEN pull requests:
 * @param {Object} filters filter by the state
 */
export const getPRs = filters => ghClient(shared.gh.pulls.list, filters, GITHUB_JSON_PATH.PR_PATH);
