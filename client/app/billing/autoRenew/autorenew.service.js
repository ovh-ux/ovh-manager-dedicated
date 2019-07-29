import {
  AUTORENEW_EVENT, CONTRACTS_IDS, NIC_URL, SERVICES_TYPE,
} from './autorenew.constants';

import BillingService from './BillingService.class';

export default class {
  /* @ngInject */
  constructor(
    $q,
    $window,
    constants,
    coreConfig,
    DucUserContractService,
    OvhApiBillingAutorenewServices,
    OvhApiEmailExchange,
    OvhHttp,
  ) {
    this.$q = $q;
    this.$window = $window;
    this.constants = constants;
    this.coreConfig = coreConfig;
    this.DucUserContractService = DucUserContractService;
    this.OvhApiBillingAutorenewServices = OvhApiBillingAutorenewServices;
    this.OvhApiEmailExchange = OvhApiEmailExchange;
    this.OvhHttp = OvhHttp;

    this.events = {
      AUTORENEW_CHANGES: AUTORENEW_EVENT,
    };
  }

  getAllServices() {
    return this.OvhHttp.get('/billing/autorenew/services', {
      rootPath: '2api',
    });
  }

  getServices(count, offset, search, type, renew, renewal, order, nicBilling) {
    return this.OvhHttp.get('/billing/autorenew/services', {
      rootPath: '2api',
      params: {
        count,
        offset,
        search,
        type,
        renew,
        renewal,
        order,
        nicBilling,
      },
    });
  }

  getService(serviceId) {
    return this.OvhApiBillingAutorenewServices.Aapi()
      .query({
        search: serviceId,
      }).$promise
      .then(services => new BillingService(_.head(services.list.results)));
  }

  getServicesTypes() {
    return this.$q.when(SERVICES_TYPE);
  }

  updateServices(updateList) {
    return this.OvhHttp.put('/sws/billing/autorenew/services/update', {
      rootPath: '2api',
      data: {
        updateList,
      },
    }).then((result) => {
      if (result.state === 'OK') {
        return result;
      }
      _.set(result, 'state', 'ERROR');
      return this.$q.reject(result);
    });
  }

  updateService(service) {
    return this.OvhApiBillingAutorenewServices.Aapi().put({}, {
      updateList: [service],
    }).$promise
      .then((result) => {
        if (result.state === 'OK') {
          return result;
        }
        return this.$q.reject(result);
      });
  }

  getAutorenew() {
    return this.OvhHttp.get(NIC_URL, {
      rootPath: 'apiv6',
    });
  }


  putAutorenew(renewParam) {
    return this.OvhHttp.put(NIC_URL, {
      rootPath: 'apiv6',
      data: renewParam,
      broadcast: AUTORENEW_EVENT,
    });
  }

  enableAutorenew(renewDay) {
    return this.OvhHttp.post(NIC_URL, {
      rootPath: 'apiv6',
      data: {
        renewDay,
      },
    });
  }

  disableAutoRenewForDomains() {
    return this.OvhHttp.post('/me/manualDomainPayment', {
      rootPath: 'apiv6',
    });
  }

  terminateHosting(serviceName) {
    return this.OvhHttp.post('/hosting/web/{hosting}/terminate', {
      rootPath: 'apiv6',
      urlParams: {
        hosting: serviceName,
      },
    });
  }

  terminateEmail(serviceName) {
    return this.OvhHttp.post('/email/domain/{domain}/terminate', {
      rootPath: 'apiv6',
      urlParams: {
        domain: serviceName,
      },
    });
  }

  terminateHostingPrivateDatabase(serviceName) {
    return this.OvhHttp.post('/hosting/privateDatabase/{serviceName}/terminate', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  }

  getEmailInfos(serviceName) {
    return this.OvhHttp.get('/email/domain/{domain}', {
      rootPath: 'apiv6',
      urlParams: {
        domain: serviceName,
      },
    });
  }

  getUserCertificates() {
    return this.OvhHttp.get('/me/certificates', {
      rootPath: 'apiv6',
    });
  }

  getExchangeService(organization, exchange) {
    return this.OvhApiEmailExchange.service().Aapi().get({
      organization,
      exchange,
    }).$promise;
  }

  getExchangeUrl(organization, service, offer, action) {
    const exchangeAbsoluteUrl = this.coreConfig.getRegion() === 'EU' && this.constants.UNIVERS !== 'web'
      ? this.constants.MANAGER_URLS.web
      : this.$window.location.href.replace(this.$window.location.hash, '#/');

    const exchangeBaseUrl = `${exchangeAbsoluteUrl}configuration/exchange_${offer.toLowerCase()}/${organization}/${service}`;

    return `${exchangeBaseUrl}?action=${action}`;
  }

  getAutorenewAgreements() {
    return this.DucUserContractService.getAgreementsToValidate(
      ({ contractId }) => _.values(CONTRACTS_IDS).includes(contractId),
    )
      .then(contracts => _.map(contracts, ({ code: name, pdf: url, id }) => ({ name, url, id })));
  }

  updateRenew(service, agreements) {
    const agreementsPromise = service.hasAutomaticRenew()
      ? this.DucUserContractService.acceptAgreements(agreements) : Promise.resolve([]);
    return agreementsPromise
      .then(() => this.updateServices([_.pick(service, ['serviceId', 'serviceType', 'renew'])]));
  }

  /* eslint-disable class-methods-use-this */
  userIsBillingOrAdmin(service, user) {
    return service
      && Boolean(user
        && (service.contactBilling === user.nichandle
          || service.contactAdmin === user.nichandle));
  }
  /* eslint-enable class-methods-use-this */

  canResiliate(service, user) {
    const canDeleteAtExpiration = service.canDeleteAtExpiration
      || (service.service && service.service.canDeleteAtExpiration);
    return canDeleteAtExpiration && this.userIsBillingOrAdmin(service, user);
  }

  canCancelResiliation(service, user) {
    return service.renew
      && service.renew.deleteAtExpiration
      && !service.renew.manualPayment
      && this.userIsBillingOrAdmin(service, user);
  }
}
