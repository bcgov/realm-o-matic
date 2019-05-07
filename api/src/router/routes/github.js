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
  updatePRState,
  createRecord,
  getRecords,
  getRequestContent,
} from '../../libs/gh-utils/gh-ops';
import { getPR } from '../../libs/gh-utils/gh-requests';
import { GITHUB_LABELS } from '../../constants';

const router = new Router();

/**
 * Update record status:
 * this is triggered after the KeyCloak job is done for IDIR and GitHub:
 * 1. if success, tag ready-for-review, send notification
 *   - if no BCeID label, then merge and close
 *   - if BCeID, send notification to reviewer
 * 2. if failed, tag request-failed and send notification with reason
 * TODO: notification feature
 */
router.put(
  '/records/setReady/:prNumber',
  asyncMiddleware(async (req, res) => {
    const { prNumber } = req.params;
    const { keycloakJobResult } = req.body;
    try {
      const { status, message } = keycloakJobResult;
      // get PR:
      const pr = await getPR(prNumber);
      // if failed, add label with reason:
      if (status === 'failed') await updatePRState(pr, false, GITHUB_LABELS.FAILED, message);
      // if BCeID, continue:
      else if (pr.labels && pr.labels.includes(GITHUB_LABELS.BCEID))
        await updatePRState(pr, false, GITHUB_LABELS.READY, message);
      // if no BCeID merge and close:
      else await updatePRState(pr, true, null, message);
      res.status(204).end();
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).json(`Unable to update the PR ${prNumber}: ${err}`);
    }
  })
);

/**
 * Create a record for the new request as a Pull Request:
 */
router.post(
  '/records/:bName',
  asyncMiddleware(async (req, res) => {
    const { bName } = req.params;
    const { request } = req.body;
    try {
      const newPr = await createRecord(bName, request);
      res.status(200).json(newPr);
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).json(`Unable to start a request record: ${err}.`);
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
      res.status(errCode).json(`Unable to fetch content of the request: ${err}.`);
    }
  })
);

/**
 * Get list of PRs based on the state and label
 * @param {String} state open, closed or all
 * @param {Array} labels array of label to filter with
 * @param {String} user requester
 */
router.get(
  '/records',
  asyncMiddleware(async (req, res) => {
    const { state, labels, user } = req.query;
    try {
      const requests = await getRecords(state, labels, user);
      res.status(200).json(requests);
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).json('Unable to fetch list of PR records.');
    }
  })
);

module.exports = router;
