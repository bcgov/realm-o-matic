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
import { setMailer } from '../../libs/email-utils';
import { EMAIL_TYPE_TO_PATH } from '../../constants/email';

const router = new Router();

router.get('/', asyncMiddleware(async (req, res) => res.status(200).end()));

router.post(
  '/email/:to',
  asyncMiddleware(async (req, res) => {
    const { to } = req.params;
    const { userInfo, realmInfo } = req.body;
    try {
      await setMailer(to, userInfo, realmInfo, EMAIL_TYPE_TO_PATH.COMPLETED);
      res.status(200).end();
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).send(`Unable to send email: ${err}.`);
    }
  })
);

module.exports = router;
