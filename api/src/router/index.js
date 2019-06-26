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

import cors from 'cors';
import passport from 'passport';
import ehlo from './routes/ehlo';
import kcIdp from './routes/kcIdp';
import github from './routes/github';
import users from './routes/users';
import email from './routes/email';

// TODO: specify the allowed origins instead of all
const corsOptions = {
  origin: '*',
  credentials: true,
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

// eslint-disable-next-line import/prefer-default-export
export const router = app => {
  app.use(cors(corsOptions));
  app.use('/api/v1/ehlo', ehlo); // probes
  // Auth needed for the endpoints:
  app.use(passport.authenticate('jwt', { session: false }));
  app.use('/api/v1/idps', kcIdp);
  app.use('/api/v1/gh', github);
  app.use('/api/v1/users', users);
  app.use('/api/v1/email', email);
};
