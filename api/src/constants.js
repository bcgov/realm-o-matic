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

export const realmSchema = {
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

export const requestSchema = {
  type: 'object',
  required: ['id', 'realm'],
  properties: {
    id: { type: 'string' },
    realm: realmSchema,
  },
};

export const prSchema = {
  type: 'object',
  required: ['number', 'status', 'fileName'],
  properties: {
    number: { type: 'number' },
    status: { type: 'string' },
    fileName: { type: 'string' },
  },
};

export const commitMessageTemplate = (user, realmName) => `${user} requested for ${realmName}.`;
