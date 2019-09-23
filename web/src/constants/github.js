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
  PROCESSING: {
    text: 'Processing',
    color: 'olive',
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
  PENDING: {
    text: 'Pending',
    color: 'orange',
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
  READY: 'request-ready',
  FAILED: 'request-failed',
  COMPLETED: 'realm-created',
  BCEID: 'bceid-requested',
  BCEID_APPROVED: 'bceid-approved',
  BCEID_REJECTED: 'bceid-rejected',
  BCEID_COMPLETED: 'bceid-enabled',
};

export const GITHUB_PR_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
};

export const getPrStatus = (state, merged, labels = []) => {
  const isMerged = merged ? true : false;
  switch (state) {
    case GITHUB_PR_STATUS.OPEN:
      // failed:
      if (labels.includes(GITHUB_LABELS.FAILED)) return REQUEST_STATUS.FAILED;
      // bceid rejected:
      else if (labels.includes(GITHUB_LABELS.BCEID_REJECTED)) return REQUEST_STATUS.REJECT;
      // when BCeID is requested, but not yet approved or completed, request is pending:
      else if (labels.includes(GITHUB_LABELS.BCEID) && !labels.includes(GITHUB_LABELS.BCEID_APPROVED) && !labels.includes(GITHUB_LABELS.BCEID_COMPLETED)) return REQUEST_STATUS.PENDING;
      // otherwise, before the PR is closed, some tasks is processing:
      else return REQUEST_STATUS.PROCESSING;
    case GITHUB_PR_STATUS.CLOSED:
      return isMerged ? REQUEST_STATUS.SUCCESS : REQUEST_STATUS.FAILED;
    default:
      // throw Error(`Unknown PR state: ${state}!`);
      return REQUEST_STATUS.UNKNOWN;
  }
};
