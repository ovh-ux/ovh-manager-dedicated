class UserContractsAcceptModalCtrl {
    constructor ($scope, UserContractService) {
        this.$scope = $scope;
        this.UserContractService = UserContractService;

        this.model = {
            accepted: {
                value: false
            }
        };

        this.contracts = {
            loading: false,
            load: () => {
                this.contracts.loading = true;
                this.UserContractService.getAgreementsToValidate((contract) => _.includes(["tos", "pp"], contract.code))
                    .then((contracts) => {
                        this.contracts.data = contracts;
                    })
                    .finally(() => {
                        this.contracts.loading = false;
                    });
            },
            data: []
        };
    }

    $onInit () {
        this.contracts.load();
    }

    agree () {
        this.saving = true;
        this.hasSubmitError = false;
        this.UserContractService.acceptAgreements(this.contracts.data)
            .then(() => this.$scope.resetAction())
            .catch(() => {
                this.model.accepted.value = false;
                this.hasSubmitError = true;
            })
            .finally(() => {
                this.saving = false;
            });
    }
}

angular.module("App").controller("UserContractsAcceptModalCtrl", UserContractsAcceptModalCtrl);
