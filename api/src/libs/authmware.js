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
// Created by Jason Leach on 2018-02-14.
//

'use strict';

import { getJwtCertificate, logger } from '@bcgov/nodejs-common-utils';
import passport from 'passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { ACCESS_CONTROL } from '../constants';
import config from '../config';

// Match the client role:
export const isAuthorized = jwtPayload => {
  return jwtPayload.roles && jwtPayload.roles.includes(ACCESS_CONTROL.SA_ROLE);
};

// authenicating app:
export const verify = (req, jwtPayload, done) => {
  if (jwtPayload) {
    if (!isAuthorized(jwtPayload)) {
      const err = new Error('You do not have the proper role for the service');
      err.code = 401;

      return done(err, null);
    }

    const user = {
      roles: jwtPayload.roles,
      name: jwtPayload.name,
      preferredUsername: jwtPayload.preferred_username,
      givenName: jwtPayload.given_name,
      familyName: jwtPayload.family_name,
      email: jwtPayload.email,
    };

    return done(null, user); // OK
  }

  const err = new Error('Unable to authenticate');
  err.code = 401;

  return done(err, false);
};

// Authenicate middleware:
export const authmware = async app => {
  app.use(passport.initialize());
  app.use(passport.session());

  // We don't store any user information.
  passport.serializeUser((user, done) => {
    logger.info('serialize');
    done(null, {});
  });

  // We don't load any addtional user information.
  passport.deserializeUser((id, done) => {
    logger.info('deserialize');
    done(null, {});
  });

  const { certificate, algorithm } = await getJwtCertificate(config.get('sso:certsUrl'));
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.algorithms = [algorithm];
  opts.secretOrKey = certificate;
  opts.passReqToCallback = true;
  // For development purposes only ignore the expiration time of tokens.
  if (config.get('environment') === 'development') {
    opts.ignoreExpiration = true;
  }

  const jwtStrategy = new JwtStrategy(opts, verify);

  passport.use(jwtStrategy);
};
