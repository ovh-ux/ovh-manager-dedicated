class FeatureAvailability {
  constructor(constants) {
    this.target = constants.target;
  }

  hasContactChangement() {
    return this.deny('CA', 'US');
  }

  hasDedicatedServerBackupStorage() {
    return this.deny('US');
  }

  hasDedicatedServerManualRefund() {
    return this.allow('US');
  }

  hasSerialOverLan() {
    return this.deny('US');
  }

  allowDedicatedServerBandwidthOption() {
    return this.allow('EU', 'CA');
  }

  allowDedicatedServerOrderBandwidthOption() {
    return this.allow('EU', 'CA');
  }

  allowDedicatedServerOrderVrackBandwidthOption() {
    return this.allow('EU', 'CA');
  }

  allowDedicatedServerOrderTrafficOption() {
    return this.allow('EU', 'CA');
  }

  allowDedicatedServerComplianceOptions() {
    return this.deny('US');
  }

  allowDedicatedServerUSBKeys() {
    return this.deny('US');
  }

  allowDedicatedServerFirewallCiscoAsa() {
    return this.deny('US');
  }

  agreeTosAndPpOnManagerLoad() {
    return this.allow('US');
  }

  allowLicenseAgoraOrder() {
    return this.allow('US');
  }

  allowLicenseTypeAgoraOrder(licenseType) {
    return this.allowLicenseAgoraOrder() && _.includes(['CLOUDLINUX', 'CPANEL', 'DIRECTADMIN', 'SQLSERVER', 'WINDOWS', 'WORKLIGHT', 'PLESK', 'VIRTUOZZO'], licenseType);
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
