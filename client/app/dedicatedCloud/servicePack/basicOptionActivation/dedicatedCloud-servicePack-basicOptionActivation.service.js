import _ from 'lodash';
import { OPTION_TYPES } from '../option/dedicatedCloud-servicePack-option.constants';

/* @ngInject */
export default class DedicatedCloudServicePackBasicOptionActivationService {
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
        servicePack => _.every(
          servicePack.options,
          option => _.isEqual(option.type, OPTION_TYPES.basicOption),
        ),
      ));
  }
}
