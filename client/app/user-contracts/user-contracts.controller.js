class UserContractsCtrl {
  constructor(
    $scope,
    $timeout,
    featureAvailability,
    DucUserContractService,
    User,
  ) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.featureAvailability = featureAvailability;
    this.User = User;
    this.DucUserContractService = DucUserContractService;
  }

  $onInit() {
    if (this.featureAvailability.agreeTosAndPpOnManagerLoad()) {
      this.DucUserContractService.getAgreementsToValidate(contract => _.includes(['tos', 'pp'], contract.code)).then((contracts) => {
        if (contracts.length) {
          this.$scope.currentAction = 'modal/user-contracts-accept';
          this.$scope.stepPath = 'user-contracts/modal/user-contracts-accept.html';
          $('#user-contracts-currentAction').modal({
            keyboard: false,
            backdrop: 'static',
          });
        }
      });
    }
  }
}

angular.module('App').controller('UserContractsCtrl', UserContractsCtrl);
