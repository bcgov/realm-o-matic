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

import { logger } from '@bcgov/common-nodejs-utils';
import {
  PR_SCHEMA,
  REQUEST_SCHEMA,
  GITHUB_REQUEST,
  GITHUB_LABELS,
  KEYCLOAK_TERMS,
} from '../../constants';
import {
  getBranch,
  createBranch,
  getPRs,
  getPR,
  createPR,
  listPRFiles,
  getFile,
  createFile,
  addLable,
  mergePR,
  deleteBranch,
} from './gh-requests';
import { validateSchema, encodeObjectWithName } from '../utils';

/**
 * Create a pr as record of request:
 * @param {String} bName name of branch
 * @param {Object} requestContent content of request
 */
export const createRecord = async (bName, requestContent) => {
  try {
    // create file content: validate and encode
    const { isValid, payload } = validateSchema(requestContent, REQUEST_SCHEMA);
    if (!isValid) throw Error(payload);
    const fileContent = encodeObjectWithName(payload.realm.id, payload);

    // create branch:
    const originRef = await getBranch(GITHUB_REQUEST.BASE_BRANCH);
    const newBranchRef = await createBranch(bName, originRef);

    // push file:
    const fileRef = await createFile(fileContent, newBranchRef);

    // start pr:
    const pr = await createPR(fileRef, newBranchRef, payload.requester);

    // if bceid is required, need to add the lable to PR
    if (payload.realm.idps.includes(KEYCLOAK_TERMS.BCEID))
      await addLable(pr.number, [GITHUB_LABELS.BCEID]);

    return pr.number;
  } catch (err) {
    logger.error(`Fail to create a request record: ${err.message}`);
    throw err;
  }
};

/**
 * Fetch the file content from a PR
 * @param {number} prNumber the pull request number
 */
export const getRequestContent = async prNumber => {
  try {
    const prInfo = await getPR(prNumber);
    const files = await listPRFiles(prNumber);
    const prFile = await getFile(files[0], prInfo.branch);
    const content = Buffer.from(prFile.content, 'base64').toString();
    const contentObject = JSON.parse(content);
    return { ...prInfo, request: contentObject };
  } catch (err) {
    logger.error(`Fail to get content of PR ${prNumber}: ${err.message}`);
    throw err;
  }
};

/**
 * Get list of requests:
 * @param {String} state the state of the request PRs
 * @param {String} user the user to filter with
 * @param {Array} labels the labels to filter with
 */
export const getRecords = async (state = 'all', labels = [], user = null) => {
  try {
    // get the PR based on state and labels:
    const prs = await getPRs({ state, labels });
    // filter by the user if mentioned:
    return user ? prs.filter(pr => pr.requester === user) : prs;
  } catch (err) {
    logger.error(`Fail to get list of PRs: ${err.message}`);
    throw err;
  }
};

/**
 * Update the state or label of a PR
 * @param {Number} pr pull request object
 * @param {Boolean} mergeAndClose is ready to merge and close PR
 * @param {String} label the label to be added
 * @param {Object} message message to comment on PR
 */
export const updatePRState = async (pr, mergeAndClose, label, message = null) => {
  try {
    const { isValid, payload } = validateSchema(pr, PR_SCHEMA);
    if (!isValid) throw Error(payload);
    logger.info(`The request from PR ${payload.number}, returns: ${message}.`);
    if (mergeAndClose) {
      await mergePR(payload.number);
      await deleteBranch(payload.branch);
    } else await addLable(payload.number, [label]);
  } catch (err) {
    logger.error(`Fail to get the list of PRs: ${err.message}`);
    throw err;
  }
};
