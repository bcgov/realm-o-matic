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

import { standardActionTypeWrapper } from '../src/actions/actionTypes';

describe('standardActionTypeWrapper', () => {
  const prefix = 'PREFIX_TEST';

  const expectedActionType = {
    START: `${prefix}_START`,
    SUCCESS: `${prefix}_SUCCESS`,
    ERROR: `${prefix}_ERROR`,
  };

  it('generates standard action types', () => {
    const testActionType = standardActionTypeWrapper(prefix);
    expect(testActionType).toEqual(expectedActionType);
  });
});
