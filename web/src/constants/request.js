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

export const API = {
  BASE_URL: () =>
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:8000/api/v1/'
      : `${window.location.origin}/api/v1/`,
  TIME_OUT: 40000,
  IDP: () => 'idps',
  REQUESTS: number => `gh/records/${number ? number : ''}`,
  NEW_REQUEST: branchName => `gh/records/${branchName}`,
  APPROVE_REQUEST: number => `gh/records/setReady/${number}`,
  AUTHORIZATION: userId => `users/auth/${userId}`,
};
