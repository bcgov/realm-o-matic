import { ImplicitAuthManager } from '@bcgov/common-web-utils';
import { SSO_CONFIG } from '../constants/auth';

const iam = new ImplicitAuthManager(SSO_CONFIG);

export default iam;
