class FeatureAvailability {
  constructor(constants) {
    this.target = constants.target;
  }

  agreeTosAndPpOnManagerLoad() {
    return this.allow('US');
  }

  allowDedicatedServerComplianceOptions() {
    return this.deny('US');
  }

  showPDFAndHTMLDepositLinks() {
    return this.deny('US');
  }

  allow(...args) {
    return Array.from(args).indexOf(this.target) > -1;
  }

  deny(...args) {
    return Array.from(args).indexOf(this.target) === -1;
  }
}

angular.module('services').service('featureAvailability', FeatureAvailability);
