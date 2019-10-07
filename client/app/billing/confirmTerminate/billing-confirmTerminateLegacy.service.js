export default class {
  constructor($q, OvhHttp) {
    this.$q = $q;
    this.OvhHttp = OvhHttp;
  }

  static getServiceTypeFromPrefix(serviceApiPrefix) {
    return serviceApiPrefix
      .replace(/^\//, '')
      .replace(/\/\{.+$/, '')
      .replace(/\//g, '_');
  }

  getServiceApi(serviceId, forceRefresh) {
    const params = {
      rootPath: 'apiv6',
      cache: 'billingTerminateService',
    };
    if (forceRefresh) {
      delete params.cache;
    }
    return this.OvhHttp.get(`/service/${serviceId}`, params);
  }

  getServiceInfo(serviceId) {
    let serviceType;
    return this.getServiceApi(serviceId)
      .then((serviceApi) => {
        serviceType = this.constructor.getServiceTypeFromPrefix(serviceApi.route.path);
        return serviceApi.route.url;
      })
      .then(url => this.OvhHttp.get(`${url}/serviceInfos`, {
        rootPath: 'apiv6',
      }))
      .then(serviceInfos => Object.assign({}, serviceInfos, {
        serviceType,
      }));
  }

  confirmTermination(
    serviceId,
    serviceName,
    futureUse,
    reason,
    commentary,
    token,
  ) {
    return this.getServiceApi(serviceId)
      .then(serviceApi => serviceApi.route.url)
      .then(url => this.OvhHttp.post(`${url}/confirmTermination`, {
        rootPath: 'apiv6',
        data: {
          reason,
          commentary,
          token,
        },
      }));
  }
}
