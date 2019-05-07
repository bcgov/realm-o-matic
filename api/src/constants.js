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

export const ACCESS_CONTROL = {
  SA_ROLE: 'devhub_kc_web',
  REQUESTER_ROLE: 'devhub_kc_requester',
  REVIEWER_ROLE: 'devhub_kc_reviewer',
};

export const REALM_SCHEMA = {
  type: 'object',
  required: ['id', 'displayName', 'adminUser', 'idps', 'po'],
  properties: {
    id: { type: 'string' },
    displayName: { type: 'string' },
    adminUser: { type: 'string' },
    idps: { type: 'array' },
    po: { type: 'string' },
  },
};


export const USER_SCHEMA = {
  type: 'object',
  required: ['username', 'email'],
  properties: {
    username: { type: 'string' },
    email: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
  },
};

export const REQUEST_SCHEMA = {
  type: 'object',
  required: ['id', 'realm'],
  properties: {
    id: { type: 'string' },
    realm: REALM_SCHEMA,
    requester: USER_SCHEMA,
  },
};

export const PR_SCHEMA = {
  type: 'object',
  required: ['number', 'state', 'fileName', 'requester'],
  properties: {
    number: { type: 'number' },
    state: { type: 'string' },
    // labels: { type: 'array' }, //TODO: when only one label, it's not an array
    fileName: { type: 'string' },
    requester: { type: 'string' },
    branch: { type: 'string' },
    realm: REALM_SCHEMA,
    requester: { type: 'string' },
  },
};

export const GITHUB_REQUEST = {
  BASE_BRANCH: 'master',
  branchRef: name => `refs/heads/${name}`,
  shortBranchRef: name => `heads/${name}`,
  recordPath: name => `records/${name}.json`,
  commitMessage: request => `Requested for ${request}.`,
};

// For jsonReader:
export const GITHUB_JSON_PATH = {
  PR_PATH: {
    optionals: ['labels.name', 'head.ref'],
    dataStructure: {
      number: 'number',
      state: 'state',
      labels: 'labels.name',
      fileName: 'title',
      requester: 'body',
      branch: 'head.ref',
    },
  },
};

export const GITHUB_LABELS = {
  BCEID: 'bceid-requested',
  FAILED: 'request-failed',
  READY: 'ready-for-review',
};

export const KEYCLOAK_TERMS = {
  BCEID: 'bceid',
};
