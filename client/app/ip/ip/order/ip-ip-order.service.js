angular.module('Module.ip.services').service('IpOrder', [
  '$http',
  '$q',
  function ($http, $q) {
    const swsProxypassPath = 'apiv6';

    function getRouteFragmentForService(serviceType) {
      switch (serviceType) {
        case 'DEDICATED':
          return 'dedicated/server';
        case 'PCC':
          return 'dedicatedCloud';
        case 'VPS':
          return 'vps';
        default:
          return serviceType;
      }
    }

    this.getServicesByType = function (type) {
      const queue = [];
      let services = [];

      if (!type || type === 'DEDICATED') {
        queue.push(
          $http.get([swsProxypassPath, 'order/dedicated/server'].join('/')).then(
            (data) => {
              const items = [];
              angular.forEach(data.data, (svc) => {
                items.push({
                  serviceType: 'DEDICATED',
                  serviceName: svc,
                });
              });
              services = services.concat(_.sortBy(items, 'serviceName'));
            },
            http => $q.reject(http.data),
          ),
        );
      }

      if (!type || type === 'PCC') {
        queue.push(
          $http.get([swsProxypassPath, 'order/dedicatedCloud'].join('/')).then(
            (data) => {
              const items = [];
              angular.forEach(data.data, (svc) => {
                items.push({
                  serviceType: 'PCC',
                  serviceName: svc,
                });
              });
              services = services.concat(_.sortBy(items, 'serviceName'));
            },
            http => $q.reject(http.data),
          ),
        );
      }

      if (!type || type === 'VPS') {
        queue.push(
          $http.get([swsProxypassPath, 'order/vps'].join('/')).then(
            (data) => {
              const items = [];
              angular.forEach(data.data, (svc) => {
                items.push({
                  serviceType: 'VPS',
                  serviceName: svc,
                });
              });
              services = services.concat(_.sortBy(items, 'serviceName'));
            },
            http => $q.reject(http.data),
          ),
        );
      }

      return $q.all(queue).then(() => services, http => $q.reject(http.data));
    };

    this.checkIfAllowed = function (service, orderEnum) {
      return $http.get([swsProxypassPath, 'order', getRouteFragmentForService(service.serviceType), service.serviceName].join('/')).then(data => data.data && data.data.length && ~data.data.indexOf(orderEnum), http => $q.reject(http.data));
    };

    this.getServiceOrderableIp = function (service) {
      switch (service.serviceType) {
        case 'DEDICATED':
          return $http.get([swsProxypassPath, 'dedicated/server', service.serviceName, 'orderable/ip'].join('/'))
            .then((response) => {
              const { data } = response;
              data.ipv4 = _.filter(data.ipv4, { type: 'failover' });
              if (!data.ipv4 || !data.ipv4.length) {
                return false;
              }

              ['ipv4', 'ipv6'].forEach((ipType) => {
                data[ipType] = _.filter(data[ipType], ipBlock => ipBlock.ipNumber > 0);
              });

              data.ipv4BlockSizesAll = data.ipv4.reduce(
                (globalArray, val) => [...val.blockSizes, ...globalArray],
                [],
              );
              data.ipv4BlockSizesAll = _.uniq(data.ipv4BlockSizesAll);
              data.ipv4BlockSizesAll.sort((a, b) => a - b);

              return data;
            });
        case 'PCC':
          return $q.when({});
        case 'VPS':
          return $http.get([swsProxypassPath, 'vps', service.serviceName].join('/')).then(
            (data) => {
              if (data.data && data.data.model) {
                return $http.get([swsProxypassPath, 'vps', service.serviceName, 'ips'].join('/')).then(
                  (dataIps) => {
                    let selfAdditionalIp = 0;
                    const queue = [];

                    angular.forEach(dataIps.data, (ip) => {
                      if (~ip.indexOf('.')) {
                        // only v4
                        queue.push(
                          $http.get([swsProxypassPath, 'vps', service.serviceName, 'ips', ip].join('/')).then((dataIp) => {
                            if (dataIp.data && dataIp.data.type === 'additional') {
                              selfAdditionalIp += 1;
                            }
                          }),
                        );
                      }
                    });

                    return $q.all(queue).then(
                      () => ({
                        maximumAdditionnalIp: data.data.model.maximumAdditionnalIp
                          - selfAdditionalIp,
                        ipRange: _.range(
                          1,
                          data.data.model.maximumAdditionnalIp - selfAdditionalIp + 1,
                        ),
                        vpsInfos: data.data,
                      }),
                      http => $q.reject(http),
                    );
                  },
                  http => $q.reject(http),
                );
              }
              return false;
            },
            http => $q.reject(http),
          );
        default:
          return null;
      }
    };

    this.getAvailableCountries = function (service) {
      switch (service.serviceType) {
        case 'DEDICATED':
          return $http.get([swsProxypassPath, 'dedicated/server', service.serviceName, 'ipCountryAvailable'].join('/')).then(data => (data.data || []).sort(), http => $q.reject(http.data));
        case 'PCC':
          return $http.get([swsProxypassPath, 'dedicatedCloud', service.serviceName, 'orderableIpCountries'].join('/')).then(data => (data.data || []).sort(), http => $q.reject(http.data));
        case 'VPS':
          return $http.get([swsProxypassPath, 'vps', service.serviceName, 'ipCountryAvailable'].join('/')).then(data => (data.data || []).sort(), http => $q.reject(http.data));
        default:
          return null;
      }
    };

    this.getProfessionalUsePrice = function (serviceName) {
      return $http.get([swsProxypassPath, 'dedicated/server', serviceName].join('/')).then(
        (data) => {
          if (data.data.professionalUse === false) {
            return $http.get([swsProxypassPath, 'price/dedicated/server/professionalUse', data.data.commercialRange].join('/')).then(data2 => data2.data.text, http => $q.reject(http.data));
          }
          return null;
        },
        http => $q.reject(http.data),
      );
    };

    this.checkIfCanadianServer = function (serviceName) {
      return $http.get([swsProxypassPath, 'dedicated/server', serviceName].join('/')).then(
        (data) => {
          if (data.data && data.data.datacenter && (/^bhs/i.test(data.data.datacenter) || /^sgp/i.test(data.data.datacenter) || /^syd/i.test(data.data.datacenter))) {
            return true;
          }
          return false;
        },
        http => $q.reject(http.data),
      );
    };

    this.getOrder = function (service, params) {
      return $http.get([swsProxypassPath, 'order', getRouteFragmentForService(service.serviceType), service.serviceName, 'ip'].join('/'), { params }).then(data => data.data, http => $q.reject(http.data));
    };

    this.getOrderForDuration = function (service, params, duration) {
      return $http.get([swsProxypassPath, 'order', getRouteFragmentForService(service.serviceType), service.serviceName, 'ip', duration].join('/'), { params }).then(data => data.data, http => $q.reject(http.data));
    };

    this.postOrder = function (service, params, duration) {
      return $http.post([swsProxypassPath, 'order', getRouteFragmentForService(service.serviceType), service.serviceName, 'ip', duration].join('/'), params).then(data => data.data, http => $q.reject(http.data));
    };

    /*= ================================
    =            MIGRATION            =
    ================================= */

    this.getServiceMigrateableIp = function (params) {
      return $http
        .get([swsProxypassPath, 'order/dedicated/server', params.service.serviceName, 'ipMigration'].join('/'), {
          params: {
            ip: params.ip,
            token: params.token,
          },
        })
        .then(data => data.data, http => $q.reject(http));
    };

    this.getMigrateIpOrder = function (params, duration) {
      return $http
        .get([swsProxypassPath, 'order/dedicated/server', params.service.serviceName, 'ipMigration', duration].join('/'), {
          params: {
            ip: params.ip,
            token: params.token,
          },
        })
        .then(data => data.data, http => $q.reject(http.data));
    };

    this.postMigrateIpOrder = function (params) {
      return $http
        .post([swsProxypassPath, 'order/dedicated/server', params.service.serviceName, 'ipMigration', params.duration].join('/'), {
          ip: params.ip,
          token: params.token,
        })
        .then(data => data.data, http => $q.reject(http.data));
    };
  },
]);
