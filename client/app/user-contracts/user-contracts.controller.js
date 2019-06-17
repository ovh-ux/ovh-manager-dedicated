class UserContractsCtrl {
  constructor(
    $scope,
    $timeout,
    coreConfig,
    DucUserContractService,
    User,
  ) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.coreConfig = coreConfig;
    this.DucUserContractService = DucUserContractService;
    this.User = User;
  }

  $onInit() {
    this.agreeTosAndPpOnManagerLoad = this.coreConfig.getRegion() === 'US';

    if (this.agreeTosAndPpOnManagerLoad) {
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
