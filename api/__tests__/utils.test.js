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

import {
  validateSchema,
  encodeObjectWithName,
  isMatch,
  flattenObject,
  normalizeData,
} from '../src/libs/utils';
import { REALM_SCHEMA } from '../src/constants';
import {
  goodObject,
  badObject,
  emptyObject,
  nestedObject,
  flattenedObject,
  prefixedObject,
  schema,
  noMatching,
} from '../__fixtures__/utils-fixture';

describe('validateSchema test', () => {
  test('returns valid payload', () => {
    expect(validateSchema(goodObject, REALM_SCHEMA)).toEqual({
      isValid: true,
      payload: goodObject,
    });
  });

  test('handles invalid content', () => {
    expect(validateSchema(badObject, REALM_SCHEMA)).toEqual({
      isValid: false,
      payload: "Fail to match schema, data should have required property 'po'",
    });
  });

  test('handles empty content', () => {
    expect(validateSchema(emptyObject, REALM_SCHEMA)).toEqual({
      isValid: false,
      payload: 'Fail to match schema, data should be object',
    });
  });
});

describe('encodeObjectWithName test', () => {
  test('returns encoded content and name', () => {
    expect(encodeObjectWithName(goodObject.id, goodObject)).toEqual({
      name: goodObject.id,
      content: Buffer.from(JSON.stringify(goodObject)).toString('base64'),
    });
  });

  test('throw when no name provided', () => {
    expect(() => encodeObjectWithName(null, goodObject)).toThrow(
      'Missing name for object to encode'
    );
  });
});

describe('isMatch test', () => {
  const testString = 'abc';
  const testArray = ['abc', 123];
  const targetArray = ['abc', 'def'];
  test('returns true if no target', () => {
    expect(isMatch(testArray, [])).toBe(true);
  });

  test('checks if string matches', () => {
    expect(isMatch(testString, testString)).toBe(true);
  });

  test('checks if string matches any in array', () => {
    expect(isMatch(testString, targetArray)).toBe(true);
  });

  test('checks if array matches', () => {
    expect(isMatch(testArray, targetArray)).toBe(true);
  });

  test('checks if empty array not match', () => {
    expect(isMatch([], targetArray)).toBe(false);
  });

  test('checks if undefined array not match', () => {
    expect(isMatch([undefined], targetArray)).toBe(false);
  });
});

describe('flattenObject test', () => {
  test('flatten json object, but not flatten array in object', () => {
    expect(flattenObject(nestedObject)).toStrictEqual(flattenedObject);
  });

  test('flatten non object inputs', () => {
    expect(flattenObject('123')).toStrictEqual('123');
    expect(flattenObject(['123'])).toStrictEqual(['123']);
    expect(flattenObject({})).toStrictEqual({});
    expect(flattenObject(null)).toStrictEqual(null);
  });

  test('add prefix', () => {
    expect(flattenObject(nestedObject, 'prefix')).toStrictEqual(prefixedObject);
  });
});

describe('normalizeData test', () => {
  test('normalize data based on schema', () => {
    expect(normalizeData(flattenedObject, schema)).toStrictEqual(nestedObject);
  });

  test('returns null when data not matching', () => {
    expect(normalizeData({}, schema)).toStrictEqual(noMatching);
  });
});
