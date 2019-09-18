import _ from 'lodash';
import BillingService from '../../../models/BillingService.class';

import { AVAILABLE_SERVICES } from './user-contacts.constants';

export default class {
  /* @ngInject */
  constructor(OvhApiOvhProduct, OvhHttp) {
    this.OvhApiOvhProduct = OvhApiOvhProduct;
    this.OvhHttp = OvhHttp;
  }

  // TODO: Find a way to inject ovh-api-services depending on the service category
  getServiceInfos(service) {
    return this.OvhHttp.get(`${service.path}/${service.serviceName}/serviceInfos`, {
      rootPath: 'apiv6',
    })
      .then(serviceInfos => new BillingService({
        ...service,
        ...serviceInfos,
      }));
  }

  changeContact(service) {
    return this.OvhHttp.post(`${service.path}/${service.serviceName}/changeContact`, {
      rootPath: 'apiv6',
      data: {
        contactAdmin: service.contactAdmin,
        contactBilling: service.contactBilling,
        contactTech: service.contactTech,
      },
    });
  }

  getServices() {
    return this.OvhApiOvhProduct.Aapi().query().$promise
      .then((services) => {
        const availableServices = _.filter(
          services,
          service => AVAILABLE_SERVICES.includes(service.category),
        );
        return availableServices.map(service => new BillingService(service));
      });
  }

  static getAvailableCategories(services) {
    return _.uniq(_.map(services, 'category'));
  }
}
