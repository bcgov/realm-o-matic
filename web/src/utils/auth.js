import { ImplicitAuthManager } from '@bcgov/common-web-utils';
import { SSO_CONFIG } from '../constants';

const iam = new ImplicitAuthManager(SSO_CONFIG);

export default iam;
