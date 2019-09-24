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

export const FORM_CONTENT_TO_REQUEST = {
  id: 'id',
  realm: {
    id: 'realmId',
    displayName: 'displayName',
    adminUser: 'adminUser',
    idps: 'idps',
    po: 'po',
  },
  requester: {
    id: 'requesterIDIR',
    email: 'requesterEmail',
    firstName: 'requesterFirstName',
    lastName: 'requesterLastName',
  },
  // optional:
  bceid: {
    appUrl: 'appUrl',
    userAmount: 'userAmount',
    forecastAmount: 'forecastAmount',
    prodDate: 'prodDate',
    useDate: 'useDate',
    // v2:
    appName: 'appName',
    contactInfo: 'contactInfo',
    orgInfo: 'orgInfo',
  },
};

export const REQUEST_TO_FORM_CONTENT = {
  id: 'id',
  realmId: 'realm.id',
  displayName: 'realm.displayName',
  requesterEmail: 'requester.email',
  requesterIDIR: 'requester.id',
  requesterLastName: 'requester.lastName',
  requesterFirstName: 'requester.firstName',
  adminUser: 'realm.adminUser',
  idps: 'realm.idps',
  po: 'realm.po',
  appUrl: 'bceid.appUrl',
  userAmount: 'bceid.userAmount',
  forecastAmount: 'bceid.forecastAmount',
  prodDate: 'bceid.prodDate',
  useDate: 'bceid.useDate',
  // v2:
  appName: 'bceid.appName',
  contactInfo: 'bceid.contactInfo',
  orgInfo: 'bceid.orgInfo',
};

const FORM_CONTENT_SCHEMA_REQUIRED = [
  'id',
  'realmId',
  'displayName',
  'requesterEmail',
  'requesterIDIR',
  'adminUser',
  'idps',
  'po',
];

export const FORM_CONTENT_SCHEMA = {
  type: 'object',
  required: FORM_CONTENT_SCHEMA_REQUIRED,
  properties: {
    id: { type: 'string' },
    realmId: { type: 'string' },
    displayName: { type: 'string' },
    requesterEmail: { type: 'string' },
    requesterIDIR: { type: 'string' },
    requesterLastName: { type: 'string' },
    requesterFirstName: { type: 'string' },
    adminUser: { type: 'string' },
    idps: { type: 'array' },
    po: { type: 'string' },
    appUrl: { type: 'string' },
    userAmount: { type: 'integer' },
    forecastAmount: { type: 'integer' },
    prodDate: { format: 'date' },
    useDate: { format: 'date' },
    // v2:
    appName: { type: 'string' },
    contactInfo: { type: 'array' },
    orgInfo: { type: 'string' },
  },
};
