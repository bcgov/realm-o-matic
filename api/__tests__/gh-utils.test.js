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

import { normalizeIssue, normalizeIssues, jsonReader } from '../src/libs/gh-utils/gh-helpers';
import { ghClient } from '../src/libs/gh-utils/gh-requests';
import { goodIssue, badIssue1, badIssue2, goodObject } from '../__fixtures__/utils-fixture';
import { mockedGHFn } from '../__mocks__/gh-fn';

describe('normalizeIssue test', () => {
  test('returns valid payload', () => {
    expect(normalizeIssue(goodIssue)).toEqual({
      issueId: 1,
      realm: goodObject,
    });
  });

  test('throws when missing content', () => {
    expect(() => normalizeIssue(badIssue1)).toThrow('Invalid GitHub issue.');
  });

  test('throws for invalid payload', () => {
    expect(() => normalizeIssue(badIssue2)).toThrow(
      "Error: Fail to match schema, data should have required property 'po'"
    );
  });
});

describe('normalizeIssues test', () => {
  test('returns array of valid issues', () => {
    expect(normalizeIssues([goodIssue, goodIssue])).toEqual([
      {
        issueId: 1,
        realm: goodObject,
      },
      {
        issueId: 1,
        realm: goodObject,
      },
    ]);
  });

  test('returns an array for single issues', () => {
    expect(normalizeIssues(goodIssue)).toEqual([
      {
        issueId: 1,
        realm: goodObject,
      },
    ]);
  });

  test('throws when no issues found', () => {
    // TODO: test error.code
    expect(() => normalizeIssues([])).toThrow('No issues found.');
  });

  test('throws for invalid issues', () => {
    expect(() => normalizeIssues([goodIssue, badIssue1])).toThrow('Error: Invalid GitHub issue.');
  });
});

describe('jsonReader test', () => {
  test('read single key value', () => {
    expect(jsonReader(goodObject, 'po')).toEqual(goodObject.po);
  });

  test('read array of key value', () => {
    expect(jsonReader(goodObject, { id: 'id', owner: 'po' })).toEqual({
      id: goodObject.id,
      owner: goodObject.po,
    });
  });

  test('return original object when no keys', () => {
    expect(jsonReader(goodObject)).toEqual(goodObject);
  });

  test('throws when missing content only in path array', () => {
    expect(() => jsonReader(goodIssue, { id: 'id', owner: 'ponot' })).toThrow(
      'Failed to read the data with ponot'
    );
  });

  test('throws when path is not expected', () => {
    expect(() => jsonReader(goodIssue, ['id', 'po'])).toThrow('Failed to read the data with po');
  });
});

describe('ghClient test', () => {
  test('handles single object returned', async () => {
    const data = await ghClient(mockedGHFn, { input: 'object' }, 'id');
    expect(data).toEqual(goodObject.id);
  });

  test('handles array object returned', async () => {
    const data = await ghClient(mockedGHFn, { input: 'array' }, 'id');
    expect(data).toEqual([goodObject.id, goodObject.id]);
  });

  test('handles null returned', async () => {
    await expect(ghClient(mockedGHFn, { input: 'null' }, 'id')).rejects.toEqual(
      Error('No data returned with the request.')
    );
  });

  test('handles unexpected returned', async () => {
    await expect(ghClient(mockedGHFn, { input: 'random' }, 'id')).rejects.toEqual(
      Error('GH request error.')
    );
  });
});
