angular.module('services').service('cdnDedicatedDomainLogs', function (OvhHttp) {
  /**
   * Get logs
   */
  this.getLogs = function (serviceName, domain) {
    return OvhHttp.post('/cdn/dedicated/{serviceName}/domains/{domain}/logs', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
        domain,
      },
    });
  };
});
