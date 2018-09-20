angular.module('Module.ip.services').service('IpReverse', [
  '$http',
  '$q',
  'constants',
  'IpExpandIpv6',
  'OvhHttp',
  function ($http, $q, constants, ExpandIpv6, OvhHttp) {
    const swsProxypassPath = 'apiv6';

    this.updateReverse = (service, ipBlock, _ip, _reverse) => {
      const reverse = _reverse ? punycode.toASCII(_reverse.replace(/\s/g, '')) : '';
      let ip = _ip;

      if (service.category === 'VPS') {
        // Special rule for crappy VPS...
        if (~_ip.indexOf(':')) {
          // And another shitty trick for ipv6 for VPS youhouuuu
          ip = ExpandIpv6.expandIPv6Address(_ip);
        }
        return $http.put([swsProxypassPath, 'vps', service.serviceName, 'ips', ip].join('/'), { reverse }, { serviceType: 'apiv6' }).then(data => data.data, http => $q.reject(http.data));
      }
      if (!reverse) {
        return this.deleteReverse(ipBlock, ip);
      }
      return $http
        .post(
          [swsProxypassPath, 'ip', window.encodeURIComponent(ipBlock), 'reverse'].join('/'),
          {
            ipReverse: ip,
            reverse,
          },
          { serviceType: 'apiv6' },
        )
        .then(data => data.data, http => $q.reject(http.data));
    };

    this.getReverse = (ipBlock, ip) => $http.get([swsProxypassPath, 'ip', `${window.encodeURIComponent(ipBlock)}/reverse/${ip}`].join('/'), { serviceType: 'apiv6' }).then(data => data.data, http => $q.reject(http.data));

    this.deleteReverse = (ipBlock, ip) => $http.delete([swsProxypassPath, 'ip', window.encodeURIComponent(ipBlock), 'reverse', ip].join('/'), { serviceType: 'apiv6' }).then(data => data.data, http => $q.reject(http.data));

    this.getDelegations = ipBlock => OvhHttp.get('/ip/{ip}/delegation', {
      rootPath: 'apiv6',
      urlParams: {
        ip: ipBlock,
      },
    });

    this.getDelegation = (ipBlock, target) => OvhHttp.get('/ip/{ip}/delegation/{target}', {
      rootPath: 'apiv6',
      urlParams: {
        ip: ipBlock,
        target: window.encodeURIComponent(target),
      },
    });

    this.setDelegation = (ipBlock, target) => OvhHttp.post('/ip/{ip}/delegation', {
      rootPath: 'apiv6',
      urlParams: {
        ip: ipBlock,
      },
      data: {
        target: window.encodeURIComponent(target),
      },
    });

    this.deleteDelegation = (ipBlock, target) => OvhHttp.delete('/ip/{ip}/delegation/{target}', {
      rootPath: 'apiv6',
      urlParams: {
        ip: ipBlock,
        target,
      },
    });
  },
]);
