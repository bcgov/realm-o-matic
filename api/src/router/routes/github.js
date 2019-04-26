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
import { getIssueList, getIssue } from '../../libs/gh-utils/gh-requests';
import { createRecord } from '../../libs/gh-utils/gh-ops';

const router = new Router();

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
      res.status(errCode).json(`Unable to start a PR: ${err}`);
    }
  })
);

router.get(
  '/:issueId',
  asyncMiddleware(async (req, res) => {
    const { issueId } = req.params;
    try {
      const ghIssue = await getIssue(issueId);
      res.status(200).json(ghIssue);
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).json(`Unable to fetch issue with id ${issueId}.`);
    }
  })
);

router.get(
  '/',
  asyncMiddleware(async (req, res) => {
    try {
      const ghIssues = await getIssueList();
      res.status(200).json(ghIssues);
    } catch (err) {
      const errCode = err.status ? err.status : 500;
      res.status(errCode).json('Unable to fetch list of open issues.');
    }
  })
);

module.exports = router;
