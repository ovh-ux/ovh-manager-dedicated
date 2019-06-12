export default class {
  /* @ngInject */
  constructor($uibModalInstance, dedicatedCloudDrp, drpInformations) {
    this.$uibModalInstance = $uibModalInstance;
    this.dedicatedCloudDrp = dedicatedCloudDrp;
    this.drpInformations = drpInformations;
  }

  confirm() {
    this.isDeleting = true;
    return this.dedicatedCloudDrp.disableDrp(this.drpInformations)
      .then(this.$uibModalInstance.close)
      .catch(this.$uibModalInstance.dismiss);
  }
}
