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
export const ghClient = async (ghFn, input, outPaths = null, expectDataResponse = true) => {
  try {
    const res = await ghFn({
      owner: config.get('github:owner'),
      repo: config.get('github:repo'),
      ...input,
    });

    const { data } = res;
    if (!data && expectDataResponse) throw Error('No data returned with the request.');
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
 * @param {Object} user the requester info
 */
export const createPR = (fileName, bName, user) =>
  ghClient(
    shared.gh.pulls.create,
    { title: fileName, head: bName, base: GITHUB_REQUEST.BASE_BRANCH, body: JSON.stringify(user) },
    GITHUB_JSON_PATH.PR_PATH
  );

/**
 * Request to get pull requests by label:
 * Note: octokit only provides filtering with the issues endpoint
 * @param {Object} filters filter by the labels and states
 */
export const getPRs = filters =>
  ghClient(shared.gh.issues.listForRepo, filters, GITHUB_JSON_PATH.PR_PATH);

/**
 * Request to fetch a pull requests:
 * @param {Number} prNumber number of PR
 */
export const getPR = prNumber =>
  ghClient(shared.gh.pulls.get, { pull_number: prNumber }, GITHUB_JSON_PATH.PR_PATH);

/**
 * List the files in a pull request:
 * @param {Number} prNumber number of PR
 */
export const listPRFiles = prNumber =>
  ghClient(shared.gh.pulls.listFiles, { pull_number: Number(prNumber) }, 'filename');

/**
 * Fetch a file from a branch:
 * @param {String} filePath path to file
 * @param {String} branchRef branch where file is
 */
export const getFile = (filePath, branchRef) =>
  ghClient(shared.gh.repos.getContents, { path: filePath, ref: branchRef });

/**
 * Add labels to a PR:
 * @param {Number} prNumber number of PR
 * @param {Array} labels array of label names
 */
export const addLable = (prNumber, labels) =>
  ghClient(shared.gh.issues.addLabels, { issue_number: prNumber, labels });

/**
 * Merge a pull request:
 * @param {Number} prNumber number of PR
 */
export const mergePR = prNumber =>
  ghClient(shared.gh.pulls.merge, { pull_number: prNumber }, 'merged');

/**
 * Delete a branch:
 * @param {String} bName name of branch
 */
export const deleteBranch = bName =>
  ghClient(shared.gh.git.deleteRef, { ref: GITHUB_REQUEST.shortBranchRef(bName) }, null, false);
