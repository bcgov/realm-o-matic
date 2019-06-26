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

import path from 'path';
import config from '../config';

export const EMAIL_CONFIG = {
  FROM: config.get('emailServer:sender'),
  TRANSPORTER: {
    host: config.get('emailServer:host'),
    port: config.get('emailServer:port'),
    secure: false, // true for 465, false for other ports
    ignoreTLS: false,
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 40000,
  },
  TEMPLATES: subpath => path.join(__dirname, './email-templates', subpath),
};

export const EMAIL_TYPE_TO_PATH = {
  STARTED: 'requestStarted',
  COMPLETED: 'requestCompleted',
};

export const APP_LINK_WITH_REALM = number => `https://${config.get('host')}/Request/${number}`;
