angular.module('Module.ip.services').service('IpMitigation', [
  '$http',
  '$q',
  'constants',
  'Poll',
  function ($http, $q, constants, Poll) {
    const swsAapiIpPath = '/sws/module/ip';
    const swsProxypassPath = 'apiv6';
    const self = this;

    this.pollMitigationState = function (ipBlock, ip) {
      return Poll.poll([swsProxypassPath, window.encodeURIComponent(`ip/${window.encodeURIComponent(ipBlock.ipBlock)}/mitigation/${ip.ip}`)].join('/'), null, { successRule: { state: 'ok' }, namespace: 'ip.mitigation' });
    };

    this.killPollMitigationState = function (ipBlock, ip) {
      let pattern;
      if (ipBlock && ip) {
        pattern = { url: [swsProxypassPath, window.encodeURIComponent(`ip/${window.encodeURIComponent(ipBlock.ipBlock)}/mitigation/${ip.ip}`)].join('/') };
      } else {
        pattern = { namespace: 'ip.mitigation' };
      }
      return Poll.kill(pattern);
    };

    this.updateMitigation = function (ipBlock, ip, mitigation) {
      if (mitigation === 'PERMANENT') {
        return $http.post(['/ip', window.encodeURIComponent(ipBlock), 'mitigation'].join('/'), { ipOnMitigation: ip }, { serviceType: 'apiv6' }).then(data => data.data, http => $q.reject(http.data));
      } if (mitigation === 'DEFAULT') {
        return $http
          .delete(['/ip', window.encodeURIComponent(ipBlock), 'mitigation', ip].join('/'), {
            serviceType: 'apiv6',
          })
          .then(data => data.data, http => $q.reject(http.data));
      }
      return $q.reject(ipBlock);
    };

    this.getMitigationDetails = function (ipBlock, ip) {
      const url = [swsProxypassPath, window.encodeURIComponent(`ip/${window.encodeURIComponent(ipBlock)}/mitigation/${ip}`)].join('/');
      return $http.get(url).then(result => result.data, http => $q.reject(http.data));
    };

    this.getMitigationStatisticsScale = function () {
      return self.getIpModels().then(ipModels => ipModels['ip.MitigationStatsScaleEnum'].enum.map(scale => `_${_.snakeCase(scale).toUpperCase()}`));
    };

    this.getIpModels = function () {
      return $http.get([swsProxypassPath, 'ip.json'].join('/'), { cache: true }).then((response) => {
        if (response && response.data && response.data.models) {
          return response.data.models;
        }
        return {};
      });
    };

    this.getMitigationStatistics = function (ipBlock, ip, from, scale, pointsCount) {
      let count = 288;
      if (pointsCount) {
        count = pointsCount;
      }
      if (ipBlock && ip && from && scale) {
        return $http
          .get([swsAapiIpPath, window.encodeURIComponent(ipBlock), 'mitigation', ip, 'statistics'].join('/'), {
            params: {
              from,
              scale: `_${_.snakeCase(scale).toUpperCase()}`,
              pointsCount: count,
            },
            serviceType: 'aapi',
          })
          .then(data => data.data, http => $q.reject(http.data));
      }
      return $q.reject(ip);
    };

    this.getMitigationRealTimeStatistics = function (ipBlock, ip) {
      if (ipBlock && ip) {
        return self.getMitigationStatistics(ipBlock, ip, moment().toISOString(), '_5_M', 30);
      }
      return $q.reject(ip);
    };
  },
]);
