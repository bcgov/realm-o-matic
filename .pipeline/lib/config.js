'use strict';
const options = require('pipeline-cli').Util.parseArguments();
const changeId = options.pr; //aka pull-request
const version = '1.0.0';
const name = 'realm-o-matic';

const phases = {
  build: {
    namespace: '6d70e7-tools',
    name: `${name}`,
    phase: 'build',
    changeId,
    suffix: `-build-${changeId}`,
    instance: `${name}-build-${changeId}`,
    version: `${version}-${changeId}`,
    tag: `build-${version}-${changeId}`,
  },
  dev: {
    namespace: '6d70e7-dev',
    name: `${name}`,
    phase: 'dev',
    changeId,
    suffix: `-dev-${changeId}`,
    instance: `${name}-dev-${changeId}`,
    version: `${version}-${changeId}`,
    tag: `dev-${version}-${changeId}`,
    host: `realm-o-matic-dev-${changeId}.developer.gov.bc.ca`,
    ssoUrl: 'https://dev.oidc.gov.bc.ca',
    reviewer: 'shelly.han@gov.bc.ca',
    admin: 'shelly.han@gov.bc.ca',
  },
  test: {
    namespace: '6d70e7-test',
    name: `${name}`,
    phase: 'test',
    changeId,
    suffix: `-test-${changeId}`,
    instance: `${name}-test-${changeId}`,
    version: `${version}-${changeId}`,
    tag: `test-${version}-${changeId}`,
    host: `realm-o-matic-test-${changeId}.developer.gov.bc.ca`,
    ssoUrl: 'https://test.oidc.gov.bc.ca',
    reviewer: 'shelly.han@gov.bc.ca',
    admin: 'shelly.han@gov.bc.ca',
  },
  prod: {
    namespace: '6d70e7-prod',
    name: `${name}`,
    phase: 'prod',
    changeId,
    suffix: `-prod`,
    instance: `${name}-prod`,
    version: `${version}-${changeId}`,
    tag: `prod-${version}-${changeId}`,
    host: 'realm-o-matic.developer.gov.bc.ca',
    ssoUrl: 'https://oidc.gov.bc.ca',
    reviewer: 'IDIM.Consulting@gov.bc.ca',
    admin: 'shelly.han@gov.bc.ca',
  },
};

// This callback forces the node process to exit as failure.
process.on('unhandledRejection', reason => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = { phases, options };
