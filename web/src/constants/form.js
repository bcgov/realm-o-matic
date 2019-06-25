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

const basicInfo = {
  name: 'realmInfo',
  title: 'Realm Information',
  elements: [
    {
      type: 'text',
      name: 'realmId',
      title: 'The Unique ID of your realm',
      isRequired: true,
      enableIf: 'false',
    },
    {
      type: 'text',
      name: 'displayName',
      title: 'The realm display name',
      isRequired: true,
    },
    {
      type: 'text',
      name: 'adminUser',
      title: 'Technical lead (administrator) of the realm (IDIR user ID)',
      isRequired: true,
    },
    {
      type: 'text',
      name: 'po',
      title: 'Email of product owner',
      isRequired: true,
      validators: [
        {
          type: 'email',
        },
      ],
    },
  ],
};

const requesterInfo = {
  name: 'requesterInfo',
  title: 'Requester Information',
  elements: [
    {
      type: 'panel',
      name: 'requester',
      elements: [
        {
          type: 'text',
          name: 'requesterEmail',
          title: 'Email',
          isRequired: true,
          enableIf: 'false',
          colCount: 0,
          validators: [
            {
              type: 'email',
            },
          ],
        },
        {
          // TODO: don't display id
          type: 'text',
          name: 'requesterIDIR',
          title: 'IDIR User ID',
          // startWithNewLine: false,
          isRequired: true,
          enableIf: 'false',
          colCount: 0,
        },
        {
          type: 'text',
          name: 'requesterLastName',
          title: 'Last Name',
          isRequired: true,
          colCount: 0,
        },
        {
          type: 'text',
          name: 'requesterFirstName',
          title: 'First Name',
          isRequired: true,
          colCount: 0,
        },
      ],
      title: 'Please provide your information as a requester',
    },
  ],
};

const idpInfo = {
  name: 'idpInfo',
  title: 'Identity Provider Information',
  elements: [
    {
      type: 'checkbox',
      name: 'idps',
      title: 'Required identity providers',
      isRequired: true,
      choices: ['IDIR', 'GitHub', 'BCeID', 'BCSC'],
    },
    {
      type: 'panel',
      name: 'bceidInfo',
      visibleIf: '{idps} contains BCeID',
      elements: [
        {
          type: 'text',
          name: 'appUrl',
          title: 'URL of Service or Application',
          isRequired: true,
        },
        {
          type: 'text',
          inputType: 'number',
          name: 'userAmount',
          title: 'Estimated volume of initial users',
          isRequired: true,
        },
        {
          type: 'text',
          inputType: 'number',
          name: 'forecastAmount',
          title: 'Forecast of anticipated growth over the next 3 years',
          isRequired: true,
        },
        // TODO: better sytle date picker
        {
          type: 'text',
          inputType: 'date',
          name: 'prodDate',
          dateFormat: 'yyyy-mm-dd',
          title: 'Date of	release in production environment',
          isRequired: true,
        },
        {
          type: 'text',
          inputType: 'date',
          name: 'useDate',
          dateFormat: 'yyyy-mm-dd',
          title: 'Date of first use by citizens / end users',
          isRequired: true,
        },
      ],
    },
  ],
};

export const formJson = {
  showProgressBar: 'top',
  showQuestionNumbers: 'off',
  pages: [basicInfo, idpInfo, requesterInfo], //TODO: add the progress and history page
};

export const realmId = {
  digit: 8,
};

export const prStatus = {
  OPEN: 'Open',
  SUCCESS: 'Success',
  FAILED: 'Failed',
  // for BCeID flow:
  PROCESSING: 'Processing',
  REJECT: 'Reject',
};

// TODO: missing BCeID flow:
export const getPrStatus = (state, merged) => {
  const isMerged = merged ? true : false;
  switch (state) {
    case 'open':
      return prStatus.OPEN;
    case 'closed':
      return isMerged ? prStatus.SUCCESS : prStatus.FAILED;
    default:
      // throw Error(`Unknow PR state: ${state}!`);
      return 'unknown';
  }
};
