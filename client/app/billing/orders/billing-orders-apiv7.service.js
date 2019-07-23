angular.module('Billing.services').service('BillingOrdersApiv7', function ($q, $http, $cacheFactory) {
  const cache = {
    orderQuery: $cacheFactory('UNIVERS_BILLING_ORDERS_APIV7_ORDER_QUERY'),
    status: $cacheFactory('UNIVERS_BILLING_ORDERS_APIV7_STATUS'),
  };

  function getQueryString(params) {
    return _.map(params, (val, key) => [encodeURIComponent(key), encodeURIComponent(val)].join('=')).join('&');
  }

  this.getExpiredOrderIds = function () {
    const params = {
      'expirationDate:lt': moment().format(),
    };

    return $http.get(`/me/order?${getQueryString(params)}`, {
      cache: cache.orderQuery,
      headers: {
        'X-Ovh-ApiVersion': 'beta',
      },
      serviceType: 'apiv7',
      transformResponse(data, headers, status) {
        if (status !== 200) {
          return data;
        }
        return angular.fromJson(data).map(id => id.toString());
      },
    });
  };

  this.getOrderIdsByStatus = function (opts) {
    const params = { $aggreg: 1 };

    if (opts.statusList && opts.statusList.length > 0) {
      params['value:in'] = opts.statusList.join(',');
    }

    return $http.get(`/me/order/*/status?${getQueryString(params)}`, {
      cache: cache.status,
      headers: {
        'X-Ovh-ApiVersion': 'beta',
      },
      serviceType: 'apiv7',
      transformResponse(data, headers, status) {
        if (status !== 200) {
          return data;
        }
        const idFromPathRegex = new RegExp('/me/order/([^/]+)/status');
        const orderStatusInfo = angular.fromJson(data);
        return orderStatusInfo.map((orderStatus) => {
          const orderId = orderStatus.path.match(idFromPathRegex)[1];
          return {
            orderId,
            status: orderStatus.value,
          };
        });
      },
    });
  };

  this.clearCache = function () {
    _.forOwn(cache, (cacheInstance) => {
      if (cacheInstance) {
        cacheInstance.removeAll();
      }
    });
  };
});
