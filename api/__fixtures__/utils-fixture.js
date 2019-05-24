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
  displayName: 'test-realm-1',
  adminUser: 'test-user',
  idps: ['github', 'idir'],
  po: 'test-user@email.com',
};

export const badObject = {
  id: 'abcd4321',
  displayName: 'test-realm-1',
  adminUser: 'test-user',
  idps: ['github', 'idir'],
  // missing po
};

export const emptyObject = null;

export const goodIssue = {
  id: 436374981,
  number: 1,
  title: 'test-realm-2',
  body:
    '{\r\n\t"id": "abcd4321",\r\n\t"displayName": "test-realm-1",\r\n\t"adminUser": "test-user",\r\n\t"idps": ["github", "idir"],\r\n\t"po": "test-user@email.com"\r\n}',
};

export const badIssue1 = {
  id: 436374981,
  number: 1,
  title: 'test-realm-2',
};

export const badIssue2 = {
  id: 436374981,
  number: 1,
  title: 'test-realm-2',
  body:
    '{\r\n\t"id": "abcd4321",\r\n\t"displayName": "test-realm-1",\r\n\t"adminUser": "test-user",\r\n\t"idps": ["github", "idir"]}',
  // missing po
};

export const user = {
  id: '123',
  email: '123',
  firstName: '123',
  lastName: '123',
};

export const prContent = {
  id: '123',
  realmId: '123',
  requester: user,
};

export const pr = {
  number: 123,
  prState: '123',
  prMerged: '123',
  labels: ['1', '2', '3'],
  realmName: '123',
  prContent: JSON.stringify(prContent),
  branch: '123',
};

export const prMissing = {
  number: 123,
  prState: '123',
  prMerged: '123',
  labels: '1',
  realmName: '123',
  prContent: JSON.stringify(prContent),
  branch: undefined,
};

export const mockedGHFnResponse = {
  id: 436374981,
  data: goodObject,
};

export const mockedGHFnArrayOfResponse = {
  id: 436374981,
  data: [goodObject, goodObject],
};
