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

import { validateSchema } from '../src/libs/utils';
import { realmSchema } from '../src/constants';
import { goodObject, badObject, emptyObject } from '../__fixtures__/utils-fixture';

describe('validateSchema test', () => {
  test('returns valid payload', () => {
    expect(validateSchema(goodObject, realmSchema)).toEqual({
      isValid: true,
      payload: goodObject,
    });
  });

  test('handles invalid content', () => {
    expect(validateSchema(badObject, realmSchema)).toEqual({
      isValid: false,
      payload: "Fail to match schema, data should have required property 'po'",
    });
  });

  test('handles empty content', () => {
    expect(validateSchema(emptyObject, realmSchema)).toEqual({
      isValid: false,
      payload: 'Fail to match schema, data should be object',
    });
  });
});
