class UserContractsAcceptModalCtrl {
    constructor ($scope, UserContractService, translator) {
        this.$scope = $scope;
        this.UserContractService = UserContractService;
        this.translator = translator;

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
        return this.contracts.load();
    }

    agree () {
        this.saving = true;
        this.hasSubmitError = false;
        this.UserContractService.acceptAgreements(this.contracts.data)
            .then(() => $("#user-contracts-currentAction").modal("hide"))
            .catch(() => {
                this.model.accepted.value = false;
                this.hasSubmitError = true;
            })
            .finally(() => {
                this.saving = false;
            });
    }

    getCheckboxLabel () {
        const codes = _.pluck(this.contracts.data, "code");
        if (_.size(codes) > 1) {
            return this.translator.tr("user_contracts_modal_checkbox_label_both");
        }
        return this.translator.tr(`user_contracts_modal_checkbox_label_${codes[0]}`);
    }
}

angular.module("App").controller("UserContractsAcceptModalCtrl", UserContractsAcceptModalCtrl);
