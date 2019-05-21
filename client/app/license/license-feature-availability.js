angular.module('Module.license').service('licenseFeatureAvailability', class {
  constructor(coreConfig) {
    'ngInject';

    this.target = coreConfig.getRegion();
  }

  allowLicenseAgoraOrder() {
    return this.allow('US');
  }

  allowLicenseTypeAgoraOrder(licenseType) {
    return this.allowLicenseAgoraOrder() && _.includes(['CLOUDLINUX', 'CPANEL', 'DIRECTADMIN', 'SQLSERVER', 'WINDOWS', 'WORKLIGHT', 'PLESK', 'VIRTUOZZO'], licenseType);
  }

  allow(...args) {
    return Array.from(args).indexOf(this.target) > -1;
  }

  deny(...args) {
    return Array.from(args).indexOf(this.target) === -1;
  }
});
