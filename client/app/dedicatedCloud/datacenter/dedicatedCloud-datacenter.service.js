import _ from 'lodash';

angular
  .module('App')
  .service('dedicatedCloudDatacenterService', class DedicatedCloudDatacenterService {
    constructor(
      OvhApiMe,
    ) {
      this.OvhApiMe = OvhApiMe;
    }

    fetchConsumptionForAllServices() {
      return this.OvhApiMe.v6().consumption().$promise;
    }

    fetchConsumptionForService(serviceId) {
      return this
        .fetchConsumptionForAllServices()
        .then(DedicatedCloudDatacenterService.keepOnlyConsumptionForService(serviceId));
    }

    static extractElementConsumption({ elements }, { id, type }) {
      return _.find(
        DedicatedCloudDatacenterService.keepOnlyElementDetailsWithType(elements, type),
        DedicatedCloudDatacenterService.keepOnlyElement(id),
      );
    }

    static keepOnlyElementDetailsWithType(elements, type) {
      return _.flatten(
        _.map(
          DedicatedCloudDatacenterService.keepOnlyElementsWithType(elements, type),
          'details',
        ),
      );
    }

    static keepOnlyConsumptionForService(serviceId) {
      return consumptionForAllServices => _.find(consumptionForAllServices, { serviceId });
    }

    static keepOnlyElementsWithType(elements, { planFamily }) {
      return _.filter(elements, { planFamily });
    }

    static keepOnlyElement(id) {
      return element => element.uniqueId.split('@')[0] === `${id}`;
    }
  });
