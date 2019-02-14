import _ from 'lodash';
import { OPTION_TYPES } from '../option/constants';

/* @ngInject */
export default class DedicatedCloudServicePackCertificationActivationService {
  constructor(
    dedicatedCloudServicePackService,
  ) {
    this.dedicatedCloudServicePackService = dedicatedCloudServicePackService;
  }

  fetchOrderable({
    currentServicePackName,
    serviceName,
    subsidiary,
  }) {
    return this.dedicatedCloudServicePackService
      .buildAllForService(serviceName, subsidiary)
      .then(servicePacks => _.filter(
        _.reject(servicePacks, { name: currentServicePackName }),
        servicePack => _.some(
          servicePack.options,
          option => _.isEqual(option.type, OPTION_TYPES.certification),
        ),
      ));
  }
}
