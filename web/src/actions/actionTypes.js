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

export const AUTHENTICATION = {
  SUCCESS: 'AUTHENTICATE_SUCCESS',
  FAILED: 'AUTHENTICATE_FAILED',
};

/**
 * Generate stander action types
 * @param {String} prefix contains the name of the action
 */
export const standardActionTypeWrapper = prefix => {
  return {
    START: `${prefix}_START`,
    SUCCESS: `${prefix}_SUCCESS`,
    ERROR: `${prefix}_ERROR`,
  };
};

export const GET_IDPS = standardActionTypeWrapper('GET_IDPS');
export const GET_REQUESTS = standardActionTypeWrapper('GET_REQUESTS');
export const NEW_REQUEST = standardActionTypeWrapper('NEW_REQUEST');
export const AUTHORIZATION = standardActionTypeWrapper('AUTHORIZATION');
export const GET_RECORD = standardActionTypeWrapper('GET_RECORD');
