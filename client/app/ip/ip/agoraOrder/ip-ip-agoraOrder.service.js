angular.module('Module.ip.services').service('IpAgoraOrder', function ($q, OvhHttp) {
  this.getServices = function () {
    // dedicated servers
    const servers = OvhHttp.get('/products', {
      rootPath: '2api',
      params: {
        product: 'SERVER',
      },
    }).then((data) => {
      if (data.errors.length > 0) {
        return $q.reject(data.errors);
      }
      return data.results.length ? data.results[0].services : [];
    });

    // private cloud
    const pcc = OvhHttp.get('/products', {
      rootPath: '2api',
      params: {
        product: 'DEDICATED_CLOUD',
      },
    }).then((data) => {
      if (data.errors.length > 0) {
        return $q.reject(data.errors);
      }
      return data.results.length ? data.results[0].services : [];
    });

    // merge results & set type
    return $q.all({ servers, pcc }).then((result) => {
      _.set(result, 'servers', _.map(result.servers, (item) => {
        _.set(item, 'type', 'DEDICATED');
        return item;
      }));
      _.set(result, 'pcc', _.map(result.pcc, (item) => {
        _.set(item, 'type', 'PRIVATE_CLOUD');
        return item;
      }));
      return _.merge(result.servers, result.pcc);
    });
  };

  this.getIpOffers = function () {
    return OvhHttp.get('/order/catalog/formatted/{catalogName}', {
      rootPath: 'apiv6',
      urlParams: {
        catalogName: 'ip',
      },
      params: {
        ovhSubsidiary: 'US',
      },
    }).then(data => data.plans);
  };
});
