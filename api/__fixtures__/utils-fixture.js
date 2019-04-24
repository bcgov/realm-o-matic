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

export const goodObject = {
  id: 'abcd4321',
  displayName: 'test-realm-2',
  adminUser: 'test-user',
  idps: ['github', 'idir'],
  po: 'test-user@email.com',
};

export const badObject = {
  id: 'abcd4321',
  displayName: 'test-realm-2',
  adminUser: 'test-user',
  idps: ['github', 'idir'],
  // missing po
};

export const emptyObject = null;

export const goodIssue = {
  issueId: 1,
  realm: goodObject,
};

export const badIssue1 = {
  issueId: 1,
};

export const badIssue2 = {
  issueId: 1,
  realm: badObject,
};
