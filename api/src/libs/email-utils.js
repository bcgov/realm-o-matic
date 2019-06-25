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

import _ from 'lodash';
import { logger } from '@bcgov/common-nodejs-utils';
import nodemailer from 'nodemailer';
import Email from 'email-templates';
import { EMAIL_CONFIG, APP_LINK_WITH_REALM } from '../constants/email';
import { KEYCLOAK_REALM_LINKS } from '../constants/keycloak';

/**
 * Create a transporter from nodemailer
 */
const transporter = nodemailer.createTransport(EMAIL_CONFIG.TRANSPORTER);

/**
 * Setup email
 * @param {String} toEmail the email address to send to
 * @param {Object} userInfo information about the requester
 * @param {Obejct} realmInfo information about the requested realm
 * @param {String} eventType the type of triggering event, as the path to the templates
 */
// eslint-disable-next-line import/prefer-default-export
export const setMailer = async (toEmail, userInfo, realmInfo, eventType) => {
  try {
    const email = new Email({
      send: true,
      preview: false,
      transport: transporter,
    });

    const result = await email.send({
      template: EMAIL_CONFIG.TEMPLATETS(eventType),
      message: {
        from: EMAIL_CONFIG.FROM,
        to: toEmail,
      },
      locals: {
        name: `${userInfo.firstName} ${userInfo.lastName}`,
        realmOMaticLink: APP_LINK_WITH_REALM(realmInfo.number),
        realmName: realmInfo.realmName,
        realmIdps: realmInfo.idps,
        realmAdmin: realmInfo.admin,
        realmLinks: KEYCLOAK_REALM_LINKS(realmInfo.realmName),
      },
    });
    if (!_.isEmpty(result.rejected)) throw Error('The');
  } catch (err) {
    logger.error(`Fail to send out email: ${err.message}`);
    throw err;
  }
};
