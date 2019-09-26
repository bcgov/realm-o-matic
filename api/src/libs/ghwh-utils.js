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

import { setMailer } from './email-utils';
import { updatePRState } from './gh-utils/gh-ops';
import { GITHUB_LABELS } from '../constants/github';
import { EMAIL_TYPE_TO_PATH, EMAIL_CONTACTS } from '../constants/email';

/** Handlers for different PR actions:
 * if PR started: email Requester
 * if merged and closed: email Admin for full completion
 * if PR labeled: email accordingly based on the label
 */
export const prCreatedActionHandler = async (requestInfo, realmInfo) => {
  try {
    // New request in progress, notify requester:
    await setMailer(
      requestInfo.requester.email,
      requestInfo.requester,
      realmInfo,
      EMAIL_TYPE_TO_PATH.STARTED
    );
  } catch (e) {
    throw e;
  }
};

export const prClosedActionHandler = async realmInfo => {
  try {
    // For successful realm creation, PR is closed and merged, notify Admin:
    await setMailer(
      EMAIL_CONTACTS.ADMIN.to,
      EMAIL_CONTACTS.ADMIN.info,
      realmInfo,
      EMAIL_TYPE_TO_PATH.COMPLETED
    );
  } catch (e) {
    throw e;
  }
};

export const prLabeledActionHandler = async (
  requestInfo,
  realmInfo,
  pullRequestContent,
  prNumber,
  actionedLabelName
) => {
  try {
    // Obtain the labels' name assigned to the PR:
    const prLabels = pullRequestContent.labels.map(l => l.name);
    // Setup pull request info:
    const prInfo = {
      number: prNumber,
      ref: pullRequestContent.head.ref,
      // Set null until enabling message feature:
      message: null,
    };

    // Handle according to different label being added:
    switch (actionedLabelName) {
      // Realm creation is finished, notify Requester:
      case GITHUB_LABELS.COMPLETED:
        await setMailer(
          requestInfo.requester.email,
          requestInfo.requester,
          realmInfo,
          EMAIL_TYPE_TO_PATH.COMPLETED
        );
        // Check if BCeID is requested, if not, close and merge:
        if (!prLabels.includes(GITHUB_LABELS.BCEID)) {
          await updatePRState(prInfo, true, prInfo.message);
        }
        break;
      // BCeID is enabled, notify Requester and Reviewer:
      case GITHUB_LABELS.BCEID_COMPLETED:
        await setMailer(
          requestInfo.requester.email,
          requestInfo.requester,
          realmInfo,
          EMAIL_TYPE_TO_PATH.BCEID_COMPLETED
        );
        await setMailer(
          EMAIL_CONTACTS.REVIEWER.to,
          EMAIL_CONTACTS.REVIEWER.info,
          realmInfo,
          EMAIL_TYPE_TO_PATH.BCEID_COMPLETED
        );
        // Close and merge PR:
        await updatePRState(prInfo, true, prInfo.message);
        break;
      // Realm creation failed, notify Admin:
      case GITHUB_LABELS.FAILED:
        await setMailer(
          EMAIL_CONTACTS.ADMIN.to,
          EMAIL_CONTACTS.ADMIN.info,
          realmInfo,
          EMAIL_TYPE_TO_PATH.FAILED
        );
        break;
      // Reviewer rejected the request, notify Requester:
      case GITHUB_LABELS.BCEID_REJECTED:
        await setMailer(
          requestInfo.requester.email,
          requestInfo.requester,
          realmInfo,
          EMAIL_TYPE_TO_PATH.BCEID_REJECTED
        );
        break;
      // Request contains BCeID IDP, notify Reviewer:
      case GITHUB_LABELS.BCEID:
        await setMailer(
          EMAIL_CONTACTS.REVIEWER.to,
          EMAIL_CONTACTS.REVIEWER.info,
          realmInfo,
          EMAIL_TYPE_TO_PATH.BCEID_STARTED
        );
        break;
      default:
        // ignore the other labels:
        break;
    }
  } catch (e) {
    throw e;
  }
};
