angular.module('services').service('cdnDedicatedManageLogs', function (OvhHttp) {
  /**
   * Get logs
   */
  this.getLogs = function (serviceName) {
    return OvhHttp.post('/cdn/dedicated/{serviceName}/logs', {
      rootPath: 'apiv6',
      urlParams: {
        serviceName,
      },
    });
  };
});
