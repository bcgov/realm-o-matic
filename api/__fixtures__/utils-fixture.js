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
  prMerged: null,
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

export const nestedObject = { pr, content: { user, goodObject } };

export const flattenedObject = {
  'content.goodObject.adminUser': 'test-user',
  'content.goodObject.displayName': 'test-realm-1',
  'content.goodObject.id': 'abcd4321',
  'content.goodObject.idps': ['github', 'idir'],
  'content.goodObject.po': 'test-user@email.com',
  'content.user.email': '123',
  'content.user.firstName': '123',
  'content.user.id': '123',
  'content.user.lastName': '123',
  'pr.branch': '123',
  'pr.labels': ['1', '2', '3'],
  'pr.number': 123,
  'pr.prContent':
    '{"id":"123","realmId":"123","requester":{"id":"123","email":"123","firstName":"123","lastName":"123"}}',
  'pr.prMerged': '123',
  'pr.prState': '123',
  'pr.realmName': '123',
};

export const prefixedObject = {
  'prefix.content.goodObject.adminUser': 'test-user',
  'prefix.content.goodObject.displayName': 'test-realm-1',
  'prefix.content.goodObject.id': 'abcd4321',
  'prefix.content.goodObject.idps': ['github', 'idir'],
  'prefix.content.goodObject.po': 'test-user@email.com',
  'prefix.content.user.email': '123',
  'prefix.content.user.firstName': '123',
  'prefix.content.user.id': '123',
  'prefix.content.user.lastName': '123',
  'prefix.pr.branch': '123',
  'prefix.pr.labels': ['1', '2', '3'],
  'prefix.pr.number': 123,
  'prefix.pr.prContent':
    '{"id":"123","realmId":"123","requester":{"id":"123","email":"123","firstName":"123","lastName":"123"}}',
  'prefix.pr.prMerged': '123',
  'prefix.pr.prState': '123',
  'prefix.pr.realmName': '123',
};

export const schema = {
  pr: {
    number: 'pr.number',
    prState: 'pr.prState',
    prMerged: 'pr.prMerged',
    labels: 'pr.labels',
    realmName: 'pr.realmName',
    prContent: 'pr.prContent',
    branch: 'pr.branch',
  },
  content: {
    user: {
      id: 'content.user.id',
      email: 'content.user.email',
      firstName: 'content.user.firstName',
      lastName: 'content.user.lastName',
    },
    goodObject: {
      id: 'content.goodObject.id',
      displayName: 'content.goodObject.displayName',
      adminUser: 'content.goodObject.adminUser',
      idps: 'content.goodObject.idps',
      po: 'content.goodObject.po',
    },
  },
};

export const noMatching = {
  pr: {
    number: null,
    prState: null,
    prMerged: null,
    labels: null,
    realmName: null,
    prContent: null,
    branch: null,
  },
  content: {
    user: {
      id: null,
      email: null,
      firstName: null,
      lastName: null,
    },
    goodObject: {
      id: null,
      displayName: null,
      adminUser: null,
      idps: null,
      po: null,
    },
  },
};
