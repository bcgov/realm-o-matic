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
import { GITHUB_REQUEST, GITHUB_LABELS } from '../../constants/github';
import { KEYCLOAK_TERMS } from '../../constants/keycloak';
import {
  FORM_CONTENT_TO_REQUEST,
  REQUEST_TO_FORM_CONTENT,
  FORM_CONTENT_SCHEMA,
} from '../../constants/form';
import {
  getBranch,
  createBranch,
  getPRs,
  getPR,
  createPR,
  listPRFiles,
  getFileBlob,
  createFile,
  addLabel,
  deleteLabel,
  mergePR,
  deleteBranch,
  getComments,
} from './gh-requests';
import { prParser } from './gh-helpers';
import { validateSchema, encodeObjectWithName, normalizeData, flattenObject } from '../utils';

/**
 * Create a pr as record of request:
 * @param {String} bName name of branch
 * @param {Object} requestContent content of request
 */
export const createRecord = async (bName, requestContent) => {
  try {
    // create file content: validate, normalized and encode
    const { isValid, payload } = validateSchema(requestContent, FORM_CONTENT_SCHEMA);
    if (!isValid) throw Error(payload);
    const normalizedContent = normalizeData(payload, FORM_CONTENT_TO_REQUEST);
    const fileContent = encodeObjectWithName(normalizedContent.realm.id, normalizedContent);

    // create branch:
    const originRef = await getBranch(GITHUB_REQUEST.BASE_BRANCH);
    const newBranchRef = await createBranch(bName, originRef);

    // push file:
    await createFile(fileContent, newBranchRef);

    // start pr:
    const prContent = {
      id: normalizedContent.id,
      realmId: normalizedContent.realm.id,
      requester: normalizedContent.requester,
    };
    const pr = await createPR(normalizedContent.realm.displayName, newBranchRef, prContent);

    // add label:
    // When a PR is created, it's ready for the realm to be created:
    await addLabel(pr.number, [GITHUB_LABELS.READY]);
    if (normalizedContent.realm.idps.includes(KEYCLOAK_TERMS.BCEID)) {
      // if bceid is required, need to add the label to PR
      await addLabel(pr.number, [GITHUB_LABELS.BCEID]);
    }
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
    // Get PR info:
    const prInfo = await getPR(prNumber);
    // Get files in the PR:
    const files = await listPRFiles(prNumber);
    // Get file content (there should be only one file):
    const prFile = await getFileBlob(files[0].fileSha);
    // Decode content:
    const content = Buffer.from(prFile.content, 'base64').toString();
    const contentObject = JSON.parse(content);
    // Flatten and normalize the content to display in the frontend:
    const flattenRecord = flattenObject(contentObject);
    const normalizedRecord = normalizeData(flattenRecord, REQUEST_TO_FORM_CONTENT);
    // Fetch PR comments:
    const prComments = await getComments(prNumber);
    const commentContents = prComments.length > 0 ? prComments.map(c => c.body) : [];
    // Return the PR with the file:
    return { ...prInfo, prContent: normalizedRecord, prComments: commentContents };
  } catch (err) {
    logger.error(`Fail to get content of PR ${prNumber}: ${err.message}`);
    throw err;
  }
};

/**
 * Get list of requests:
 * 1. request to get all PRs based on state and base branch
 * 2. validate PR and the content
 * 3. filter by labels and user if needed
 * @param {String} prState the state of the request PRs
 * @param {String} userId the user to filter with, value as the user ID
 * @param {Array} labels the labels to filter with
 */
export const getRecords = async (prState = 'all', labels = [], userId = null) => {
  try {
    // get the PR based on state and labels:
    const prs = await getPRs({ state: prState, base: 'master' });
    // Validate and filter PRs:
    const resultPrs = prs.reduce((accuPrs, pr) => {
      const target = prParser(pr, labels, userId);
      const resultPr = target ? [target] : [];
      return [...accuPrs, ...resultPr];
    }, []);
    return resultPrs;
  } catch (err) {
    logger.error(`Fail to get list of PRs: ${err.message}`);
    throw err;
  }
};

/**
 * Update the state of the PR: merging, closing or commenting
 * @param {Number} prInfo pull request metadata: number and ref branch
 * @param {Boolean} mergeAndClose is ready to merge and close PR
 * @param {Object} message message to comment on PR
 */
export const updatePRState = async (prInfo, mergeAndClose, message = null) => {
  try {
    if (mergeAndClose) {
      // When PR is ready to merge and close:
      await mergePR(prInfo.number);
      await deleteBranch(prInfo.ref);
    } else if (message) {
      // rejecting the PR and post messages
    } else {
      // rejecting the PR, no message
    }
  } catch (err) {
    logger.error(`Fail to update the PR state: ${err.message}`);
    throw err;
  }
};

/**
 * Update PR labels
 * @param {Number} prNumber PR number
 * @param {String} originalLabelName the label to be removed
 * @param {String} newLabelName the new label to add to PR
 */
export const alterPRLabels = async (prNumber, originalLabelName, newLabelName) => {
  try {
    await addLabel(prNumber, [newLabelName]);
    // Ignore failure in removing label:
    try {
      await deleteLabel(prNumber, originalLabelName);
    } catch (error) {
      logger.error(`Trying to remove label ${originalLabelName} from PR #${prNumber}: ${error}`);
    }
  } catch (err) {
    logger.error(`Fail to update PR labels: ${err.message}`);
    throw err;
  }
};
