angular.module('Module.ip.services').service('IpFirewall', [
  '$http',
  '$q',
  'constants',
  'Poll',
  function ($http, $q, constants, Poll) {
    const swsProxypassPath = 'apiv6';
    const self = this;

    /* POLLING : state */

    this.pollFirewallState = function (ipBlock, ip) {
      return Poll.poll([swsProxypassPath, `ip/${window.encodeURIComponent(ipBlock.ipBlock)}/firewall/${ip.ip}`].join('/'), null, { successRule: { state: 'ok' }, namespace: 'ip.firewall' });
    };

    this.killPollFirewallState = function (ipBlock, ip) {
      let pattern;
      if (ipBlock && ip) {
        pattern = { url: [swsProxypassPath, `ip/${window.encodeURIComponent(ipBlock.ipBlock)}/firewall/${ip.ip}`].join('/') };
      } else {
        pattern = { namespace: 'ip.firewall' };
      }
      return Poll.kill(pattern);
    };

    /* POLLING : rule state */

    this.pollFirewallRule = function (ipBlock, ip, sequence) {
      return Poll.poll([swsProxypassPath, `ip/${window.encodeURIComponent(ipBlock)}/firewall/${ip}/rule/${sequence}`].join('/'), null, { successRule: { state: 'ok' }, namespace: 'ip.firewall.rule' });
    };

    this.killPollFirewallRule = function (ipBlock, ip, sequence) {
      let pattern;
      if (ipBlock && ip) {
        pattern = { url: [swsProxypassPath, `ip/${window.encodeURIComponent(ipBlock)}/firewall/${ip}/rule/${sequence}`].join('/') };
      } else {
        pattern = { namespace: 'ip.firewall.rule' };
      }
      return Poll.kill(pattern);
    };

    // ---

    this.getIpModels = function () {
      return $http.get([swsProxypassPath, 'ip.json'].join('/'), { cache: true }).then((response) => {
        if (response && response.data && response.data.models) {
          return response.data.models;
        }
        return {};
      });
    };

    this.addFirewall = function (ipBlock, ip) {
      return $http
        .post(
          [swsProxypassPath, `ip/${window.encodeURIComponent(ipBlock)}/firewall`].join('/'),
          {
            ipOnFirewall: ip,
          },
          {
            serviceType: 'apiv6',
          },
        )
        .then(data => data.data, http => $q.reject(http.data));
    };

    this.toggleFirewall = function (ipBlock, ip, enabled) {
      return $http
        .put(
          [swsProxypassPath, `ip/${window.encodeURIComponent(ipBlock)}/firewall/${ip}`].join('/'),
          {
            enabled,
          },
          {
            serviceType: 'apiv6',
          },
        )
        .then(data => data.data, http => $q.reject(http.data));
    };

    this.getFirewallDetails = function (ipBlock, ip) {
      const url = ['/ip', window.encodeURIComponent(ipBlock), 'firewall', ip].join('/');
      return $http.get(url, { serviceType: 'apiv6' }).then(result => result.data, http => $q.reject(http.data));
    };

    this.getFirewallRuleConstants = function () {
      return self.getIpModels().then(ipModels => ({
        actions: ipModels['ip.FirewallActionEnum'].enum,
        protocols: ipModels['ip.FirewallProtocolEnum'].enum,
        sequences: ipModels['ip.FirewallSequenceRangeEnum'].enum,
        tcpOptions: ipModels['ip.FirewallTCPOptionEnum'].enum,
      }));
    };

    this.getFirewallRules = function (ipBlock, ip, elementsToDisplay, fromIndex) {
      return $http
        .get(['/sws/module/ip', window.encodeURIComponent(ipBlock), 'firewall', ip, 'rules'].join('/'), {
          params: {
            elementsToDisplay,
            fromIndex,
          },
          serviceType: 'aapi',
        })
        .then(result => result.data, http => $q.reject(http.data));
    };

    this.addFirewallRule = function (ipBlock, ip, rule) {
      if (rule.tcpOptions && rule.tcpOptions.option === 'NONE') {
        delete rule.tcpOptions.option; // eslint-disable-line
      }
      let isIpBlock = true;

      if (rule.source) {
        isIpBlock = rule.source.search('/') !== -1;
      }
      const url = ['/ip', window.encodeURIComponent(ipBlock), 'firewall', ip, 'rule'].join('/');
      const cleanRule = angular.copy(rule);
      cleanRule.sequence = cleanRule.sequence.key;

      if (!isIpBlock) {
        cleanRule.source = `${rule.source}/32`;
      }

      cleanRule.tcpOption = cleanRule.tcpOptions;
      delete cleanRule.tcpOptions;
      return $http.post(url, cleanRule, { serviceType: 'apiv6' }).then(data => data.data);
    };

    this.removeFirewallRule = function (ipBlock, ip, sequence) {
      return $http.delete(['/ip', window.encodeURIComponent(ipBlock), 'firewall', ip, 'rule', sequence].join('/'), { serviceType: 'apiv6' }).then(data => data.data, http => $q.reject(http.data));
    };
  },
]);
