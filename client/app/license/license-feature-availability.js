angular.module('Module.license').service('licenseFeatureAvailability', class {
  constructor(constants) {
    'ngInject';

    this.target = constants.target;
  }

  allowLicenseAgoraOrder() {
    return this.allow('US', 'EU', 'CA');
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
