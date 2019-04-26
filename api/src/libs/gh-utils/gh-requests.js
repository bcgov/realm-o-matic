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

import { GITHUB } from '../../constants';
import shared from '../shared';
import config from '../../config';
import { normalizeIssues } from './gh-helpers';

/**
 * Request to get a branch by name:
 * @param {String} bName name of branch
 */
export const getBranch = async bName => {
  try {
    const res = await shared.gh.repos.getBranch({
      owner: config.get('github:owner'),
      repo: config.get('github:repo'),
      branch: bName,
    });

    return res.data.commit.sha;
  } catch (err) {
    throw err;
  }
};

/**
 * Request to create a branch by name:
 * @param {String} bName name of branch
 * @param {String} base sha of base commit
 */
export const createBranch = async (bName, base) => {
  try {
    const res = await shared.gh.git.createRef({
      owner: config.get('github:owner'),
      repo: config.get('github:repo'),
      ref: GITHUB.branchRef(bName),
      sha: base,
    });

    // Full branch name: e.g. 'refs/heads/xxx'
    return res.data.ref;
  } catch (err) {
    throw err;
  }
};

/**
 * Request to create and push file:
 * @param {String} bName name of branch
 * @param {Object} file file object
 */
export const createFile = async (file, bName) => {
  try {
    const res = await shared.gh.repos.createFile({
      owner: config.get('github:owner'),
      repo: config.get('github:repo'),
      path: GITHUB.recordPath(file.name),
      message: GITHUB.commitMessage(file.name),
      content: file.content,
      branch: bName,
    });

    return res.data.content.name;
  } catch (err) {
    throw err;
  }
};

/**
 * Request to create pull request:
 * @param {String} bName name of branch
 * @param {String} fileName name of file
 */
export const createPR = async (fileName, bName) => {
  try {
    const res = await shared.gh.pulls.create({
      owner: config.get('github:owner'),
      repo: config.get('github:repo'),
      title: fileName,
      head: bName,
      base: GITHUB.BASE_BRANCH,
    });

    return {
      number: res.data.number,
      status: res.data.state,
      fileName: res.data.title,
    };
  } catch (err) {
    throw err;
  }
};

/**
 * Request to get list of open GitHub issues:
 */
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

/**
 * Request to get a GitHub issue:
 * @param {String} issueId id of issue
 */
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
