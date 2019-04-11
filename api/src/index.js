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

import bodyParser from 'body-parser';
import express from 'express';
import { logger } from '@bcgov/nodejs-common-utils';
import { router } from './router';
import { authmware } from './libs/authmware';

const app = express();

// To parse the request body payload:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Authentication middleware
authmware(app);

// Server API routes
router(app);

// Error handleing middleware. This needs to be last in or it will not get called.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.error(err.message);
  const code = err.code ? err.code : 500;
  const message = err.message ? err.message : 'Internal Server Error';

  res.status(code).json({ error: message, success: false });
});

module.exports = app;
