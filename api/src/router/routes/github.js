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

import { asyncMiddleware } from '@bcgov/common-nodejs-utils';
import { Router } from 'express';
import {
  createRecord,
  getRecords,
  getRequestContent,
  alterPRLabels,
} from '../../libs/gh-utils/gh-ops';
import { GITHUB_LABELS } from '../../constants/github';

const router = new Router();

/**
 * BCeID approval:
 * TODO: update this flow with github PR review api
 * - Update a PR with BCEID_REQUESTED label when BCeID is approved, add the READY label
 * - When rejected, add the BCEID_REJECTED label
 */
router.put(
  '/records/setReady/:prNumber',
  asyncMiddleware(async (req, res) => {
    const { prNumber } = req.params;
    const { approvalContent } = req.body;
    try {
      // TODO: handle rejection message
      // eslint-disable-next-line no-unused-vars
      const { isApproved, message } = approvalContent;

      // Alter between labels of rejected and ready:
      if (!isApproved)
        await alterPRLabels(prNumber, GITHUB_LABELS.BCEID_APPROVED, GITHUB_LABELS.BCEID_REJECTED);
      else
        await alterPRLabels(prNumber, GITHUB_LABELS.BCEID_REJECTED, GITHUB_LABELS.BCEID_APPROVED);

      res.status(204).end();
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).send(`Unable to label the PR ${prNumber}: ${err}`);
    }
  })
);

/**
 * Create a record for the new request as a Pull Request:
 */
router.post(
  '/records/:branchName',
  asyncMiddleware(async (req, res) => {
    const { branchName } = req.params;
    const { request } = req.body;
    try {
      const newPr = await createRecord(branchName, request);
      res.status(200).json(newPr);
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).send(`Unable to start a request record: ${err}.`);
    }
  })
);

/**
 * Get the request record of a Pull Request:
 */
router.get(
  '/records/:prNumber',
  asyncMiddleware(async (req, res) => {
    const { prNumber } = req.params;
    try {
      const requestInfo = await getRequestContent(prNumber);
      res.status(200).json(requestInfo);
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).send(`Unable to fetch content of the request: ${err}.`);
    }
  })
);

/**
 * Get list of PRs based on the state and label
 * @param {String} state open, closed or all
 * @param {Array} labels array of label to filter with
 * @param {String} useId requester use ID
 */
router.get(
  '/records',
  asyncMiddleware(async (req, res) => {
    const { state, labels, userId } = req.query;
    try {
      const requests = await getRecords(state, labels, userId);
      res.status(200).json(requests);
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).send('Unable to fetch list of PR records.');
    }
  })
);

module.exports = router;
