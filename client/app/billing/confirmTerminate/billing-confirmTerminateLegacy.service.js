export default class {
  constructor($q, OvhHttp) {
    this.$q = $q;
    this.OvhHttp = OvhHttp;
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

  getServiceInfo(serviceApi) {
    let serviceType;
    return this.$q.when(true)
      .then(() => {
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
    serviceApi,
    reason,
    commentary,
    token,
  ) {
    return this.OvhHttp.post(`${serviceApi.route.url}/confirmTermination`, {
      rootPath: 'apiv6',
      data: {
        reason,
        commentary,
        token,
      },
    });
  }

  /*
    Extract service from API endpoint
    Example:
      "/dedicated/server/{serviceName}" => "dedicated_server"
  */
  static getServiceTypeFromPrefix(serviceApiPrefix) {
    return serviceApiPrefix
      .replace(/^\//, '')
      .replace(/\/\{.+$/, '')
      .replace(/\//g, '_');
  }
}
