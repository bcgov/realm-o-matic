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

export const PR_STATUS = {
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
  READY: 'ready-for-review',
  REJECTED: 'request-rejected',
};

export const getPrStatus = (state, merged, labels = []) => {
  const isMerged = merged ? true : false;
  switch (state) {
    case 'open':
      if (labels.includes(GITHUB_LABELS.READY)) return PR_STATUS.PROCESSING;
      else if (labels.includes(GITHUB_LABELS.REJECTED)) return PR_STATUS.REJECT;
      else return PR_STATUS.OPEN;
    case 'closed':
      return isMerged ? PR_STATUS.SUCCESS : PR_STATUS.FAILED;
    default:
      // throw Error(`Unknow PR state: ${state}!`);
      return PR_STATUS.UNKNOWN;
  }
};
