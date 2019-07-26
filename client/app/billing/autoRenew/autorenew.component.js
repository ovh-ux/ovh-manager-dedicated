import controller from './autorenew.controller';
import template from './autorenew.html';

export default {
  bindings: {
    agreementsLink: '<',
    canDisableAllDomains: '<',
    currentActiveLink: '<',
    disableAutorenewForDomains: '<',
    filtersOptions: '<',
    getSMSAutomaticRenewalURL: '<',
    getSMSCreditBuyingURL: '<',
    homeLink: '<',
    isEnterpriseCustomer: '<',
    nicBilling: '<',
    services: '<',
    sshLink: '<',
  },
  controller,
  template,
};
