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
import { GITHUB_REQUEST, GITHUB_JSON_PATH } from '../../constants/github';
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
 * @param {String} displayName display name of the realm
 * @param {Object} baseInfo PR ID with realm ID and requester info
 */
export const createPR = (displayName, branchName, baseInfo) =>
  ghHelper(
    shared.gh.pulls.create,
    {
      title: displayName,
      head: branchName,
      base: GITHUB_REQUEST.BASE_BRANCH,
      body: JSON.stringify(baseInfo),
    },
    GITHUB_JSON_PATH.PR_PATH
  );

/**
 * Request to get pull requests:
 * @param {Object} filters filter by the state and the base branch
 */
export const getPRs = filters => ghHelper(shared.gh.pulls.list, filters, GITHUB_JSON_PATH.PR_PATH);

/**
 * Request to fetch a pull requests:
 * @param {Number} prNumber number of PR
 */
export const getPR = prNumber =>
  ghHelper(shared.gh.pulls.get, { pull_number: prNumber }, GITHUB_JSON_PATH.PR_PATH);

/**
 * List the files in a pull request:
 * @param {Number} prNumber number of PR
 */
export const listPRFiles = prNumber =>
  ghHelper(
    shared.gh.pulls.listFiles,
    { pull_number: Number(prNumber) },
    GITHUB_JSON_PATH.PR_FILE_PATH
  );
// ghHelper(shared.gh.pulls.listFiles, { pull_number: Number(prNumber) }, 'filename');

/**
 * Fetch a file from a branch:
 * @param {String} filePath path to file
 * @param {String} branchRef branch where file is
 */
export const getFile = (filePath, branchRef) =>
  ghHelper(shared.gh.repos.getContents, { path: filePath, ref: branchRef });

/**
 * Fetch a file blobs in PR:
 * @param {String} fileSha sha
 */
export const getFileBlob = fileSha => ghHelper(shared.gh.git.getBlob, { file_sha: fileSha });

/**
 * Add labels to a PR:
 * @param {Number} prNumber number of PR
 * @param {Array} labels array of label names
 */
export const addLabel = (prNumber, labels) =>
  ghHelper(shared.gh.issues.addLabels, { issue_number: prNumber, labels });

/**
 * Merge a pull request:
 * @param {Number} prNumber number of PR
 */
export const mergePR = prNumber =>
  ghHelper(shared.gh.pulls.merge, { pull_number: prNumber }, 'merged');

/**
 * Delete a branch:
 * @param {String} bName name of branch
 */
export const deleteBranch = bName =>
  ghHelper(shared.gh.git.deleteRef, { ref: GITHUB_REQUEST.shortBranchRef(bName) }, null, false);
