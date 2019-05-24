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

import { jsonReader, prParser } from '../src/libs/gh-utils/gh-helpers';
import { ghHelper } from '../src/libs/gh-utils/gh-requests';
import {
  goodIssue,
  goodObject,
  pr,
  prMissing,
  user,
  prContent,
} from '../__fixtures__/utils-fixture';
import { mockedGHFn } from '../__mocks__/gh-fn';

describe('jsonReader test', () => {
  test('read single key value', () => {
    expect(jsonReader(goodObject, 'po')).toEqual(goodObject.po);
  });

  test('read array of key value', () => {
    expect(
      jsonReader(goodObject, { optionals: [], dataStructure: { id: 'id', owner: 'po' } })
    ).toEqual({
      id: goodObject.id,
      owner: goodObject.po,
    });
  });

  test('return original object when no keys', () => {
    expect(jsonReader(goodObject)).toEqual(goodObject);
  });

  test('throws when missing content only in path array', () => {
    expect(() =>
      jsonReader(goodIssue, { optionals: [], dataStructure: { id: 'id', owner: 'ponot' } })
    ).toThrow('Failed to read data with key: ponot');
  });

  test('not throw undefined value if key is optional', () => {
    expect(
      jsonReader(goodObject, {
        optionals: ['notThere'],
        dataStructure: { id: 'id', owner: 'po', sth: 'notThere' },
      })
    ).toEqual({
      id: goodObject.id,
      owner: goodObject.po,
    });
  });

  test('throws when path is not expected', () => {
    expect(() => jsonReader(goodIssue, { optionals: [], dataStructure: ['id', 'po'] })).toThrow(
      'Failed to read data with key: po'
    );
  });
});

describe('ghHelper test', () => {
  test('handles single object returned', async () => {
    const data = await ghHelper(mockedGHFn, { input: 'object' }, 'id');
    expect(data).toEqual(goodObject.id);
  });

  test('handles array object returned', async () => {
    const data = await ghHelper(mockedGHFn, { input: 'array' }, 'id');
    expect(data).toEqual([goodObject.id, goodObject.id]);
  });

  test('handles null returned', async () => {
    await expect(ghHelper(mockedGHFn, { input: 'null' }, 'id')).rejects.toEqual(
      Error('No data returned with the request.')
    );
  });

  test('handles unexpected returned', async () => {
    await expect(ghHelper(mockedGHFn, { input: 'random' }, 'id')).rejects.toEqual(
      Error('GH request error.')
    );
  });
});

describe('prParser test', () => {
  test('return input when no filter', async () => {
    const target = prParser(pr);
    expect(target).toEqual({ ...pr, ...{ prContent } });
  });

  test('return input when matching filter', async () => {
    const target = prParser(pr, pr.labels, user.id);
    expect(target).toEqual({ ...pr, ...{ prContent } });
  });

  test('not return when labels not matching', async () => {
    const target = prParser(pr, ['not exsiting']);
    expect(target).toBeNull();
  });

  test('not return when userId not matching', async () => {
    const target = prParser(pr, 'no such user id');
    expect(target).toBeNull();
  });

  test('return input in other cases', async () => {
    const target = prParser(prMissing, pr.labels, user.id);
    expect(target).toEqual({ ...prMissing, ...{ prContent } });
  });
});
