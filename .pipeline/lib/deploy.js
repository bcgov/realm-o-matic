'use strict';
const { OpenShiftClientX } = require('pipeline-cli');
const path = require('path');

module.exports = settings => {
  const phases = settings.phases;
  const options = settings.options;
  const phase = options.env;
  const changeId = phases[phase].changeId;
  const oc = new OpenShiftClientX(Object.assign({ namespace: phases[phase].namespace }, options));
  const templatesLocalBaseUrl = oc.toFileUrl(path.resolve(__dirname, '../../openshift'));
  var objects = [];

  // The deployment of your cool app goes here ▼▼▼
  objects = objects.concat(
    oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/api-dc.yaml`, {
      param: {
        NAME: `${phases[phase].name}-api`,
        SUFFIX: phases[phase].suffix,
        VERSION: phases[phase].tag,
        HOST_VALUE: phases[phase].host,
        API_PORT_VALUE: 8000,
        API_SSO_URL_VALUE: phases[phase].ssoUrl,
        API_SSO_REALM_VALUE: 'devhub',
        API_SSO_CLIENT_ID_VALUE: 'realm-o-matic-api',
        REVIEW_EMAIL_VALUE: phases[phase].reviewer,
        ADMIN_EMAIL_VALUE: phases[phase].admin,
      },
    })
  );

  objects = objects.concat(
    oc.processDeploymentTemplate(`${templatesLocalBaseUrl}/web-dc.yaml`, {
      param: {
        NAME: `${phases[phase].name}-web`,
        SUFFIX: phases[phase].suffix,
        VERSION: phases[phase].tag,
        HOST_VALUE: phases[phase].host,
        REACT_APP_SSO_BASE_URL_VALUE: phases[phase].ssoUrl,
        REACT_APP_SSO_REALM_NAME_VALUE: 'devhub',
        REACT_APP_SSO_CLIENT_ID_VALUE: 'realm-o-matic-web',
      },
    })
  );

  oc.applyRecommendedLabels(
    objects,
    phases[phase].name,
    phase,
    `${changeId}`,
    phases[phase].instance
  );
  oc.importImageStreams(objects, phases[phase].tag, phases.build.namespace, phases.build.tag);
  oc.applyAndDeploy(objects, phases[phase].instance);
};
