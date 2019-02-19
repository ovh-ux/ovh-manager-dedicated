import _ from 'lodash';
import { OPTION_TYPES } from '../option/constants';

/* @ngInject */
export default class DedicatedCloudServicePackBasicOptionActivationService {
  constructor(
    dedicatedCloudServicePack,
  ) {
    this.dedicatedCloudServicePack = dedicatedCloudServicePack;
  }

  fetchOrderable({
    currentServicePackName,
    serviceName,
    subsidiary,
  }) {
    return this.dedicatedCloudServicePack
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
