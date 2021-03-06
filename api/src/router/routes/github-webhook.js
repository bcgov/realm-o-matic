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
import { PR_CONTENT_SCHEMA } from '../../constants/github';
import { setMailer } from '../../libs/email-utils';
import { EMAIL_TYPE_TO_PATH, PR_ACTIONS } from '../../constants/email';
import {
  prCreatedActionHandler,
  prClosedActionHandler,
  prLabeledActionHandler,
} from '../../libs/ghwh-utils';
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
 */
router.post(
  '/pr',
  asyncMiddleware(async (req, res) => {
    const { body } = req;
    try {
      // eslint-disable-next-line camelcase
      const { action, number, pull_request, label } = body;

      // check if pr content is valid, need to parse the content as it's string:
      const { isValid, payload } = validateSchema(JSON.parse(pull_request.body), PR_CONTENT_SCHEMA);
      if (!isValid) {
        throw Error('Invalid PR content from the webhook');
      }

      // Setup realm name and link to the request (based on PR number) in email content:
      const realmInfo = {
        number,
        realmName: payload.realmId,
      };

      // Handle according to different PR actions:
      switch (action) {
        case PR_ACTIONS.OPENED:
          await prCreatedActionHandler(payload, realmInfo);
          break;
        case PR_ACTIONS.LABELED:
          await prLabeledActionHandler(payload, realmInfo, pull_request, number, label.name);
          break;
        case PR_ACTIONS.CLOSED:
          await prClosedActionHandler(realmInfo);
          break;
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
