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
// Created by Jason Leach on 2018-02-14.
//

'use strict';

import dotenv from 'dotenv';
import nconf from 'nconf';
import url from 'url';

const env = process.env.NODE_ENV || 'development';
const defaultPort = 8000;

if (env === 'development') {
  dotenv.config();
}

/**
 * These settings contain sensitive information and should not be
 * stored in the repo. They are extracted from environment variables
 * and added to the config.
 */

// overrides are always as defined
nconf.overrides({
  environment: env,
  host: process.env.API_HOST || '127.0.0.1',
  port: process.env.API_PORT || defaultPort,
  sso: {
    clientId: process.env.API_SSO_CLIENT_ID,
    clientSecret: process.env.API_SSO_CLIENT_SECRET,
    grantType: 'client_credentials',
    tokenUrl: url.resolve(
      process.env.API_SSO_URL ? process.env.API_SSO_URL : '',
      `/auth/realms/${process.env.API_SSO_REALM}/protocol/openid-connect/token`
    ),
    certsUrl: url.resolve(
      process.env.API_SSO_URL ? process.env.API_SSO_URL : '',
      `/auth/realms/${process.env.API_SSO_REALM}/protocol/openid-connect/certs`
    ),
  },
  github: {
    auth: process.env.GITHUB_TOKEN,
    owner: process.env.GITHUB_OWNER,
    repo: process.env.GITHUB_REPO,
  },
  emailServer: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    sender: process.env.EMAIL_SENDER,
  },
  emailContacts: {
    admin: {
      to: process.env.ADMIN_EMAIL || '',
      info: {
        firstName: 'Admin',
        lastName: 'User',
      },
    },
    reviewer: {
      to: process.env.REVIEW_EMAIL || '',
      info: {
        firstName: 'Realm',
        lastName: 'Reviewer',
      },
    },
  },
});

export default nconf;
