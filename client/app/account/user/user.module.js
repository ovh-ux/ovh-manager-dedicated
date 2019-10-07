import './newAccountForm/new-account-form.module';
import config from '../../config/config';
import supportLevel from './support-level/support-level.module';

angular
  .module('UserAccount', [
    'ja.qr',
    'ovh-utils-angular',
    'ovhSignupApp',
    supportLevel,
  ])
  .constant('UserAccount.constants', {
    aapiRootPath: config.aapiRootPath,
    swsProxyRootPath: config.swsProxyRootPath,
    target: config.target,
  })
  .constant('CountryConstants', {
    support: config.constants.URLS.support,
  })
  .constant('AccountCreationURLS', config.constants.accountCreation)
  .constant('sshkey-regex', [
    {
      name: 'RSA',
      regex: /^(ssh-rsa)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
    },
    {
      name: 'ECDSA',
      regex: /^(ecdsa-sha2-nistp[0-9]+)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
    },
    {
      name: 'ED25519',
      regex: /^(ssh-ed25519)\s+(A{4}[0-9A-Za-z +/]+[=]{0,3})\s+(\S+)$/,
    },
  ])
  .run([
    '$rootScope',
    'UserAccount.constants',
    function ($rootScope, userAccountConstants) {
      _.set($rootScope, 'target', userAccountConstants.target);
      _.set($rootScope, 'worldPart', userAccountConstants.target);
    },
  ]);
