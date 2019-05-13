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
      title: 'The administrator of the realm (IDIR username)',
      isRequired: true,
    },
    {
      type: 'checkbox',
      name: 'idps',
      title: 'Required identity providers',
      isRequired: true,
      choices: ['IDIR', 'GitHub', 'BCeID'],
    },
    {
      type: 'text',
      name: 'po',
      title: 'The product owner of project',
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
          type: 'text',
          name: 'requesterIDIR',
          title: 'IDIR Username',
          // startWithNewLine: false,
          isRequired: true,
          enableIf: 'false',
          colCount: 0,
        },
        {
          type: 'text',
          name: 'requesterLastName',
          title: 'Last Name (optional)',
          colCount: 0,
        },
        {
          type: 'text',
          name: 'requesterFirstName',
          title: 'First Name (optional)',
          colCount: 0,
        },
      ],
      title: 'Requester Information',
    },
  ],
};

export const formJson = {
  showProgressBar: 'top',
  showQuestionNumbers: 'off',
  pages: [basicInfo, requesterInfo],
};

export const formDataToRequest = {
  id: 'id',
  realm: {
    id: 'realmId',
    displayName: 'displayName',
    adminUser: 'adminUser',
    idps: 'idps',
    po: 'po',
  },
  requester: {
    username: 'requesterIDIR',
    email: 'requesterEmail',
    firstName: 'requesterFirstName',
    lastName: 'requesterLastName',
  },
};

export const requestToFormData = {
  id: 'id',
  realmId: 'realm.id',
  displayName: 'realm.displayName',
  requesterEmail: 'requester.email',
  requesterIDIR: 'requester.username',
  requesterLastName: 'requester.lastName',
  requesterFirstName: 'requester.firstName',
  adminUser: 'realm.adminUser',
  idps: 'realm.adminUser',
  po: 'realm.po',
};
