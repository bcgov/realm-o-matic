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

export const REQUEST_STATUS = {
  OPEN: {
    text: 'Open',
    color: 'orange',
  },
  SUCCESS: {
    text: 'Success',
    color: 'green',
  },
  FAILED: {
    text: 'Failed',
    color: 'red',
  },
  // for BCeID flow:
  PROCESSING: {
    text: 'Processing',
    color: 'olive',
  },
  REJECT: {
    text: 'Rejected',
    color: 'red',
  },
  UNKNOWN: {
    text: 'unknown',
    color: 'grey',
  },
};

export const GITHUB_LABELS = {
  BCEID: 'bceid-requested',
  FAILED: 'request-failed',
  READY: 'request-ready',
  REJECTED: 'request-rejected',
};

export const GITHUB_PR_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
};

export const getPrStatus = (state, merged, labels = []) => {
  const isMerged = merged ? true : false;
  switch (state) {
    case GITHUB_PR_STATUS.OPEN:
      if (labels.includes(GITHUB_LABELS.READY)) return REQUEST_STATUS.PROCESSING;
      else if (labels.includes(GITHUB_LABELS.REJECTED)) return REQUEST_STATUS.REJECT;
      else return REQUEST_STATUS.OPEN;
    case GITHUB_PR_STATUS.CLOSED:
      return isMerged ? REQUEST_STATUS.SUCCESS : REQUEST_STATUS.FAILED;
    default:
      // throw Error(`Unknown PR state: ${state}!`);
      return REQUEST_STATUS.UNKNOWN;
  }
};
