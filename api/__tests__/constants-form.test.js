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

import { mapBceidContactObjectForRoles } from '../src/constants/form';

const inputArray = ['role1', 'role2', 'role3'];
const expectedContactObjects = {
  role1: {
    email: 'bceid.contactInfo.role1.email',
    name: 'bceid.contactInfo.role1.name',
    title: 'bceid.contactInfo.role1.title',
  },
  role2: {
    email: 'bceid.contactInfo.role2.email',
    name: 'bceid.contactInfo.role2.name',
    title: 'bceid.contactInfo.role2.title',
  },
  role3: {
    email: 'bceid.contactInfo.role3.email',
    name: 'bceid.contactInfo.role3.name',
    title: 'bceid.contactInfo.role3.title',
  },
};

describe('BCEID_CONTACT_INFO_SCHEMA test', () => {
  test('return an object of contact objects', () => {
    expect(mapBceidContactObjectForRoles(inputArray)).toEqual(expectedContactObjects);
  });

  test('return an empty object when no key', () => {
    expect(mapBceidContactObjectForRoles([])).toEqual({});
  });
});
