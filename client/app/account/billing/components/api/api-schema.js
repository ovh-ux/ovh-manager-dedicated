angular.module('Billing.services').service('BillingApiSchema', [
  '$cacheFactory',
  'OvhHttp',
  function ($cacheFactory, OvhHttp) {
    const cacheName = 'UNIVERS_BILLING_API_SCHEMA';

    this.getSchema = function (apiName) {
      if (!apiName || !angular.isString(apiName)) {
        throw new TypeError('ApiSchema.getSchema expects the api name in one string');
      }

      return OvhHttp.get('/{apiName}.json', {
        rootPath: 'apiv6',
        cache: cacheName,
        urlParams: {
          apiName,
        },
      });
    };

    this.clearCache = function () {
      const cacheInstance = $cacheFactory.get(cacheName);
      if (cacheInstance) {
        cacheInstance.removeAll();
      }
    };
  },
]);
