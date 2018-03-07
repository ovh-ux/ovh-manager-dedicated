class UserContractsCtrl {
    constructor ($scope, $timeout, featureAvailability, User, UserContractService) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.featureAvailability = featureAvailability;
        this.User = User;
        this.UserContractService = UserContractService;

        this.$scope.resetAction = () => this.resetAction();
    }

    $onInit () {
        if (this.featureAvailability.agreeTosAndPpOnManagerLoad()) {
            this.UserContractService.getAgreementsToValidate((contract) => _.includes(["tos", "pp"], contract.code)).then((contracts) => {
                if (contracts.length) {
                    this.$scope.currentAction = "modal/user-contracts-accept";
                    this.$scope.stepPath = "user-contracts/modal/user-contracts-accept.html";
                    $("#currentAction").modal({
                        keyboard: false,
                        backdrop: "static"
                    });
                }
            });
        }
    }

    resetAction () {
        $("#currentAction").modal("hide");
        this.$scope.currentActionData = null;
        this.$timeout(function () {
            this.$scope.stepPath = "";
        }, 300);
    }
}

angular.module("App").controller("UserContractsCtrl", UserContractsCtrl);
