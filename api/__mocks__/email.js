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

import nodemailer from 'nodemailer';

export const EMAIL_TEST_CONTENT = {
  USER_INFO: {
    firstName: 'foo',
    lastName: 'bar',
  },
  REALM_INFO: {
    number: 123,
    realmName: 'test-realm-123',
  },
  TO: 'shelly.han@gov.bc.ca',
};

/**
 * Create a test email transporter for testing:
 * - to see the test email: nodemailer.getTestMessageUrl(sendEmailResult)
 */
export const setTransporter = async () => {
  const testAccount = await nodemailer.createTestAccount();

  const testTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  return testTransporter;
};
