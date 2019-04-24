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

import { normalizeIssue, normalizeIssues } from '../src/libs/gh-utils';
import { goodIssue, badIssue1, badIssue2, goodObject } from '../__fixtures__/utils-fixture';

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
