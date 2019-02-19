import DedicatedCloudServicePack from '../service';

/* @ngInject */
export default class {
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
      .then(servicePacks => DedicatedCloudServicePack
        .keepOnlyOrderableCertificates(servicePacks, currentServicePackName));
  }
}
