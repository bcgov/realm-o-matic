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

// Name convention for the identity providers' name on bcgov keycloak:
export const KC_IDP_NAMES = {
  IDIR: 'IDIR',
  GITHUB: 'GitHub',
  BCEID: 'BCeID',
  BCSC: 'BCSC',
};

/** The content to display on the request form:
 * page 1 - basicInfo: realm information
 * page 2 - requesterInfo: requester information (mainly for email contact)
 * page 3 - idpInfo: identity provider information,
 *          plus extra questionnaire for BCeID/BCSC (bceidInfo + bceidContactUsersInfo)
 */
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
      title: 'IDIR account username for realm administrator (the technical lead)',
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
          // Note: this field will not be visible
          type: 'text',
          name: 'requesterIDIR',
          title: 'IDIR User ID',
          isRequired: true,
          enableIf: 'false',
          colCount: 0,
          visibleIf: '1 == 0',
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

const bceidContactUsersInfo = {
  type: 'matrixdropdown',
  name: 'contactInfo',
  title: 'Key Contacts',
  columns: [
    {
      cellType: 'text',
      name: 'name',
      title: 'Name',
      isRequired: true,
    },
    {
      cellType: 'text',
      name: 'title',
      title: 'Title',
      isRequired: true,
    },
    {
      cellType: 'text',
      name: 'email',
      title: 'Email',
      isRequired: true,
      validators: [
        {
          type: 'email',
        },
      ],
    },
  ],
  rows: [
    {
      value: 'es',
      text: 'Executive Sponsor',
    },
    {
      value: 'pm',
      text: 'Project Manager/Business Lead',
    },
    {
      value: 'tl',
      text: 'Technical Lead',
    },
    {
      value: 'pl',
      text: 'Privacy Lead',
    },
    {
      value: 'sl',
      text: 'Security Lead',
    },
    {
      value: 'cl',
      text: 'Communications  Lead',
    },
  ],
};

const bceidInfo = [
  {
    type: 'panel',
    name: 'organizationInfo',
    title: '1. Organization Details',
    elements: [
      {
        type: 'text',
        name: 'orgInfo',
        title: 'Organization - Division - Branch - Program',
        isRequired: true,
      },
      bceidContactUsersInfo,
    ],
  },
  {
    type: 'panel',
    name: 'serviceInfo',
    title: '2. Service',
    elements: [
      {
        type: 'text',
        name: 'appUrl',
        title: 'URL of Service or Application',
        isRequired: true,
      },
      {
        type: 'text',
        name: 'appName',
        title: 'Name of Service or Application',
        isRequired: true,
        startWithNewLine: false,
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
        startWithNewLine: false,
      },
    ],
  },
  {
    type: 'panel',
    name: 'projectInfo',
    title: '3. Project',
    elements: [
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
        startWithNewLine: false,
      },
    ],
  },
];

// TODO: enable BCSC when ready
const idpInfo = {
  name: 'idpInfo',
  title: 'Identity Provider Information',
  elements: [
    {
      type: 'checkbox',
      name: 'idps',
      title: 'Required identity providers',
      isRequired: true,
      choices: [
        {
          value: KC_IDP_NAMES.IDIR,
          text: 'IDIR (Required for admin user login)',
          enableIf: 'false',
        },
        KC_IDP_NAMES.GITHUB,
        KC_IDP_NAMES.BCEID,
        // KC_IDP_NAMES.BCSC,
      ],
    },
    {
      type: 'panel',
      name: 'bceidInfo',
      title: 'BCeID / BCSC On-Boarding Questionnaire',
      visibleIf: `{idps} contains ${KC_IDP_NAMES.BCEID}`,
      // visibleIf: '{idps} contains BCeID or {idps} contains BCSC',
      elements: bceidInfo,
    },
  ],
};

export const formJson = {
  showProgressBar: 'top',
  showQuestionNumbers: 'off',
  pages: [basicInfo, requesterInfo, idpInfo],
};

export const realmId = {
  digit: 8,
};
