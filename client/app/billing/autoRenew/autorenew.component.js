import controller from './autorenew.controller';
import template from './autorenew.html';

export default {
  bindings: {
    agreementsLink: '<',
    canCancelResiliation: '<',
    canDisableAllDomains: '<',
    canResiliate: '<',
    cancelServiceResiliation: '<',
    currentActiveLink: '<',
    disableAutorenewForDomains: '<',
    disableBulkAutorenew: '<',
    enableBulkAutorenew: '<',
    filtersOptions: '<',
    getSMSAutomaticRenewalURL: '<',
    getSMSCreditBuyingURL: '<',
    homeLink: '<',
    isEnterpriseCustomer: '<',
    nicBilling: '<',
    resiliateService: '<',
    resiliateExchangeService: '<',
    services: '<',
    sshLink: '<',
    updateExchangeBilling: '<',
    updateServices: '<',
  },
  controller,
  template,
};
