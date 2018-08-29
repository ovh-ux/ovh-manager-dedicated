/* eslint-disable no-unused-vars */
angular.module('UserAccount').service('UserValidator', [
  function () {
    const self = this;

    /**
     *
     * Don't use this service anymore!!! use common/Validator.js from univers
     *
     */
    this.isValidIpv4 = function (ip) {
      let isValid;
      try {
        // Coz sometimes ipaddr is buggy
        isValid = ip && ip.split('.').length === 4 && ipaddr.IPv4.isValid(ip);
      } catch (e) {
        isValid = false;
      }
      return isValid;
    };

    // @todo use a regexp instead
    this.isValidIpv4Block = function (block) {
      const split = block.split('/');
      return split.length === 2
        && this.isValidIpv4(split[0])
        && parseInt(split[1], 10) > 0
        && parseInt(split[1], 10) < 33;
    };

    this.isValidIpv6 = function (ip) {
      let isValid;
      try {
        // Coz sometimes ipaddr is buggy
        isValid = ip && ipaddr.IPv6.isValid(ip);
      } catch (e) {
        isValid = false;
      }
      return isValid;
    };

    // TODO use a regexp instead
    this.isValidIpv6Block = function (block) {
      const split = block.split('/');
      return split.length === 2
        && this.isValidIpv6(split[0])
        && parseInt(split[1], 10) > 0
        && parseInt(split[1], 10) < 129;
    };

    // optsParam.canBeginWithUnderscore = specifics NDD can be like: _foo._bar.example.com
    // optsParam.canBeginWithWildcard = specifics NDD can be like: *.foo.bar.example.com
    this.isValidDomain = function (domain, optsParam) {
      let opts = optsParam;

      if (!opts) {
        opts = {};
      }

      let inError = false;

      if (domain) {
        const punycodeVersion = punycode.toASCII(domain.trim());
        const dotSplit = punycodeVersion.split('.');

        // Check lengths
        inError = punycodeVersion.length > 255 || dotSplit.length < 2;

        // Check wildcard
        if (!inError && ~punycodeVersion.indexOf('*') && (opts.canBeginWithWildcard ? !/^(?:\*\.)[^*]+$/.test(punycodeVersion) : true)) {
          inError = true;
        }

        // Check subdomain(s)
        if (!inError) {
          angular.forEach(dotSplit, (sub) => {
            if (sub.length > 63 || /(?:(?:^\s*$)|(?:^-)|(?:-$))/.test(sub)) {
              inError = true;
            }
            if (~sub.indexOf('_') && (opts.canBeginWithUnderscore ? !/^_[^_]+$/.test(sub) : true)) {
              inError = true;
            }
          });
        }

        // Check chars globally
        if (!inError) {
          inError = !/^[\w\-.*]+$/.test(punycodeVersion);
        }
      }
      return !inError;
    };

    this.isValidSubDomain = function (subDomain, opts) {
      return self.isValidDomain(`${subDomain}.example.com`, opts);
    };
  },
]);
/* eslint-enable no-unused-vars */
