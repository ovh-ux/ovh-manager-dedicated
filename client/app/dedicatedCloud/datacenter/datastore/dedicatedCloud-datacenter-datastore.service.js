angular
  .module('App')
  .service('dedicatedCloudDataCenterDatastoreService', class {
    constructor(
      OvhHttp,
    ) {
      this.OvhHttp = OvhHttp;
    }

    fetchLegacyHourlyConsumption(serviceName, datacenterId, filerId) {
      return this.OvhHttp
        .get(`/dedicatedCloud/${serviceName}/datacenter/${datacenterId}/filer/${filerId}/hourlyConsumption`, {
          rootPath: 'apiv6',
        });
    }
  });
