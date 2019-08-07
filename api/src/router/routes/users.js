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
import { ACCESS_CONTROL } from '../../constants/keycloak';

const router = new Router();

/**
 * Get the user authorization status
 */
router.get(
  '/auth/:userId',
  asyncMiddleware(async (req, res) => {
    // const { userId } = req.params;
    const { roles } = req.query;
    try {
      let authorizationCode = ACCESS_CONTROL.NO_ROLE;
      if (roles.includes(ACCESS_CONTROL.REVIEWER_ROLE)) {
        authorizationCode = ACCESS_CONTROL.REVIEWER_ROLE;
      } else if (roles.includes(ACCESS_CONTROL.REQUESTER_ROLE)) {
        authorizationCode = ACCESS_CONTROL.REQUESTER_ROLE;
      }

      res.status(200).json(authorizationCode);
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).send(`Unable to determind authorization status of the user: ${err}.`);
    }
  })
);

module.exports = router;
