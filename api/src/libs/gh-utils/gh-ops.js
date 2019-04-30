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
import { requestSchema, GITHUB_REQUEST } from '../../constants';
import { getBranch, createBranch, createFile, createPR, getPRs } from './gh-requests';
import { validateSchema, objectToEncodedFile } from '../utils';

/**
 * Create a pr as record of request:
 * @param {String} bName name of branch
 * @param {Object} requestContent content of request
 */
export const createRecord = async (bName, requestContent) => {
  try {
    // create file content: validate and encode
    const { isValid, payload } = validateSchema(requestContent, requestSchema);
    if (!isValid) throw Error(payload);
    const fileContent = objectToEncodedFile(payload.realm.id, payload);

    // create branch:
    const originRef = await getBranch(GITHUB_REQUEST.BASE_BRANCH);
    const newBranchRef = await createBranch(bName, originRef);

    // // push file:
    const fileRef = await createFile(fileContent, newBranchRef);

    // // start pr:
    const prRef = await createPR(fileRef, newBranchRef, payload.requester);

    return prRef;
  } catch (err) {
    logger.error(`Fail to create a request record: ${err.message}`);
    throw err;
  }
};

/**
 * Get list of requests:
 * @param {String} state the state of the request PR
 * @param {String} user the user to filter with
 */
export const getRecords = async (state = 'all', user = null) => {
  try {
    const prs = await getPRs({ state });
    return user ? prs.filter(pr => pr.requester === user) : prs;
  } catch (err) {
    logger.error(`Fail to get list of ${state} requests: ${err.message}`);
    throw err;
  }
};
