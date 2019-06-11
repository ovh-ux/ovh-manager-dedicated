export default class {
  /* @ngInject */
  constructor($uibModalInstance, dedicatedCloudDrp, drpInformations) {
    this.$uibModalInstance = $uibModalInstance;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.drpInformations = drpInformations;
  }

  confirm() {
    return this.dedicatedCloudDrp.disableDrp(this.drpInformations);
  }
}
