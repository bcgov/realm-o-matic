/* eslint-disable indent */
/* eslint-disable no-console */
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
import { validateSchema } from '../../libs/utils';
import { updatePRState } from '../../libs/gh-utils/gh-ops';
import { PR_CONTENT_SCHEMA, GITHUB_LABELS } from '../../constants/github';
import { setMailer } from '../../libs/email-utils';
import { EMAIL_TYPE_TO_PATH, PR_ACTIONS, EMAIL_CONTACTS } from '../../constants/email';
import { EMAIL_TEST_CONTENT } from '../../constants/email-mock';

const router = new Router();

/**
 * Test email server with mock content:
 */
router.get(
  '/test',
  asyncMiddleware(async (req, res) => {
    try {
      await setMailer(
        EMAIL_TEST_CONTENT.TO,
        EMAIL_TEST_CONTENT.USER_INFO,
        EMAIL_TEST_CONTENT.REALM_INFO,
        EMAIL_TYPE_TO_PATH.COMPLETED
      );
      res.status(200).json({ message: 'Email sent.' });
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).send(err);
    }
  })
);

/**
 * Trigger by repo PR webhook and send email notification
 * TODO:
 * - use octokit/webhooks/verify to test secret (headers['x-hub-signature'];)
 * 
 * if PR started: email Requester
 * if PR labeled: email accordingly based on the label
 * if merged and closed: email Admin for full completion
 */
router.post(
  '/pr',
  asyncMiddleware(async (req, res) => {
    const { body } = req;
    try {
      // eslint-disable-next-line camel case
      const { action, number, pull_request, label } = body;

      // check if pr content is valid, need to parse the content as it's string:
      const { isValid, payload } = validateSchema(JSON.parse(pull_request.body), PR_CONTENT_SCHEMA);
      if (!isValid) {
        throw Error('Invalid PR content from the webhook');
      }

      const realmInfo = {
        number,
        realmName: payload.realmId,
      };

      const prInfo = {
        number,
        ref: pull_request.head.ref,
        // Set null until enabling message feature:
        message: null,
      };

      switch (action) {
        case PR_ACTIONS.OPENED:
          // New request in progress, notify requester:
          await setMailer(
            payload.requester.email,
            payload.requester,
            realmInfo,
            EMAIL_TYPE_TO_PATH.STARTED
          );
          break;
        case PR_ACTIONS.LABELED:
          // Obtain the labels assigned to the PR
          const prLabels = pull_request.labels.map(l => l.name);
          switch (label.name) {
            // Realm creation is finished, notify Requester:
            case GITHUB_LABELS.COMPLETED:
              await setMailer(
                payload.requester.email,
                payload.requester,
                realmInfo,
                EMAIL_TYPE_TO_PATH.COMPLETED
              );
              // Check if BCeID is requested, if not, close and merge:
              if (!prLabels.includes(GITHUB_LABELS.BCEID)) {
                await updatePRState(prInfo, true, prInfo.message);
              }
              break;
            // BCeID is enabled, notify Requester and Reviewer:
            case GITHUB_LABELS.BCEID_COMPLETED:
              await setMailer(
                payload.requester.email,
                payload.requester,
                realmInfo,
                EMAIL_TYPE_TO_PATH.BCEID_COMPLETED
              );
              await setMailer(
                EMAIL_CONTACTS.REVIEWER.to,
                EMAIL_CONTACTS.REVIEWER.info,
                realmInfo,
                EMAIL_TYPE_TO_PATH.BCEID_COMPLETED
              );
              // Close and merge PR:
              await updatePRState(prInfo, true, prInfo.message);
              break;
            // Realm creation failed, notify Admin:
            case GITHUB_LABELS.FAILED:
              await setMailer(
                EMAIL_CONTACTS.ADMIN.to,
                EMAIL_CONTACTS.ADMIN.info,
                realmInfo,
                EMAIL_TYPE_TO_PATH.FAILED
              );
              break;
            // Reviewer rejected the request, notify Requester:
            case GITHUB_LABELS.BCEID_REJECTED:
              await setMailer(
                payload.requester.email,
                payload.requester,
                realmInfo,
                EMAIL_TYPE_TO_PATH.BCEID_REJECTED
              );
              break;
            // Request contains BCeID IDP, notify Reviewer:
            case GITHUB_LABELS.BCEID:
              await setMailer(
                EMAIL_CONTACTS.REVIEWER.to,
                EMAIL_CONTACTS.REVIEWER.info,
                realmInfo,
                EMAIL_TYPE_TO_PATH.BCEID_STARTED
              );
              break;
            default:
              // ignore the other labels:
              break;
          }
          break;
        // For successful realm creation, PR is closed and merged, notify Admin:
        case PR_ACTIONS.CLOSED:
          await setMailer(
            EMAIL_CONTACTS.ADMIN.to,
            EMAIL_CONTACTS.ADMIN.info,
            realmInfo,
            EMAIL_TYPE_TO_PATH.COMPLETED
          );
        default:
          // ignore the rest:
          break;
      }

      res.status(200).end();
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).send(`Unable to email notify user or close PR: ${err}.`);
    }
  })
);

module.exports = router;
