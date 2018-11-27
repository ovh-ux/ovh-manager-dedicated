class UserContractsCtrl {
  constructor(
    $scope,
    $timeout,
    constants,
    User,
    DucUserContractService,
  ) {
    this.$scope = $scope;
    this.$timeout = $timeout;
    this.constants = constants;
    this.User = User;
    this.DucUserContractService = DucUserContractService;
  }

  $onInit() {
    this.agreeTosAndPpOnManagerLoad = this.constants.target === 'US';

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
