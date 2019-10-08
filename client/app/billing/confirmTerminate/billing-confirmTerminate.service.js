export default class {
  constructor(
    OvhHttp,
  ) {
    this.OvhHttp = OvhHttp;
  }

  getServiceApi(serviceId, forceRefresh) {
    return this.OvhHttp.get(`/services/${serviceId}`, {
      rootPath: 'apiv6',
      ...(forceRefresh ? { cache: 'billingTerminateService' } : {}),
    });
  }
}
