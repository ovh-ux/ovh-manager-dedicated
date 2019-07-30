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
    getRenewUrl: '<',
    getServices: '<',
    getSMSAutomaticRenewalURL: '<',
    getSMSCreditBuyingURL: '<',
    hasAutoRenew: '<',
    homeLink: '<',
    isEnterpriseCustomer: '<',
    isInDebt: '<',
    nicBilling: '<',
    resiliateService: '<',
    resiliateExchangeService: '<',
    selectedType: '<',
    services: '<',
    serviceTypes: '<',
    sshLink: '<',
    updateExchangeBilling: '<',
    updateServices: '<',
  },
  controller,
  template,
};
