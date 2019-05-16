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

import config from '../config.json';

export const SSO_CONFIG = {
  baseURL: process.env.REACT_APP_SSO_BASE_URL || config.ssoBaseUrl,
  realmName: process.env.REACT_APP_SSO_REALM_NAME || config.ssoRealmName,
  clientId: process.env.REACT_APP_SSO_CLIENT_ID || config.ssoClientId,
};

export const SSO_IDP = {
  GITHUB: 'github',
  IDIR: 'idir',
};

export const ACCESS_CONTROL = {
  REQUESTER_ROLE: 'devhub_kc_requester',
  REVIEWER_ROLE: 'devhub_kc_reviewer',
  NO_ROLE: 'unauthorized',
};
