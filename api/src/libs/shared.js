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

import { JWTServiceManager } from '@bcgov/nodejs-common-utils';
import Octokit from '@octokit/rest';
import config from '../config';

// Assign keys:
const ssoKey = Symbol.for('ca.bc.gov.pathfinder.realm-o-matic-api.sso');
const ghKey = Symbol.for('ca.bc.gov.pathfinder.realm-o-matic-api.gh');
const gs = Object.getOwnPropertySymbols(global);

// TODO: might need a client in the master realm and realm management, and update config/
// SSO:
if (!(gs.indexOf(ssoKey) > -1)) {
  global[ssoKey] = new JWTServiceManager({
    uri: config.get('sso:tokenUrl'),
    grantType: config.get('sso:grantType'),
    clientId: config.get('sso:clientId'),
    clientSecret: config.get('sso:clientSecret'),
  });
}

// GitHub:
if (!(gs.indexOf(ghKey) > -1)) {
  global[ghKey] = new Octokit(config.get('github'));
}

const singleton = {};

Object.defineProperty(singleton, 'sso', {
  get: () => global[ssoKey],
});

Object.defineProperty(singleton, 'gh', {
  get: () => global[ghKey],
});

Object.freeze(singleton);

export default singleton;
