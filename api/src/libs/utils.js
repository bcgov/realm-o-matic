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
import Ajv from 'ajv';

// eslint-disable-next-line import/prefer-default-export
export const validateSchema = (object, schema) => {
  let isValid = false;
  if (!object || _.isEmpty(object))
    return {
      isValid,
      payload: 'Empty payload!',
    };
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  isValid = validate(object);
  return {
    isValid,
    payload: isValid ? object : `Fail to match schema, ${ajv.errorsText(validate.errors)}`,
  };
};
