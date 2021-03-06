/* eslint-disable indent */
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

import { mockedGHFnResponse, mockedGHFnArrayOfResponse } from '../__fixtures__/utils-fixture';

// eslint-disable-next-line import/prefer-default-export
export const mockedGHFn = params => {
  const { input } = params;
  return new Promise((resolve, reject) => {
    let response;
    switch (input) {
      case 'array':
        response = mockedGHFnArrayOfResponse;
        break;
      case 'object':
        response = mockedGHFnResponse;
        break;
      case 'null':
        response = '';
        break;
      default:
        reject(Error('GH request error.'));
    }
    resolve(response);
  });
};
