angular
    .module("UserAccount")
    .controller("UserAccountAgreementsController", ($scope, $translate, Alerter, OvhApiMe, UserAccountAgreements) => {
        $scope.loaders = {
            toActivate: true,
            toActivateList: true
        };
        $scope.toActivate = [];
        $scope.agreed = {};

        function init () {
            $scope.loading = true;
            $scope.list = [];

            return $scope.getToValidate();
        }

        $scope.loadAgreementsList = function (count, offset) {
            init();

            return UserAccountAgreements
                .getList(count, offset)
                .then((agreements) => {
                    $scope.list = agreements;
                })
                .catch((err) => Alerter.error(`${$translate.instant("user_agreements_error")} ${_.get(err, "message") || err}`, "agreements_alerter"))
                .finally(() => {
                    $scope.loading = false;
                });
        };

        $scope.getToValidate = function () {
            $scope.toActivate = [];
            $scope.loaders.toActivate = true;

            return UserAccountAgreements
                .getToValidate()
                .then((agreements) => {
                    $scope.toActivate = agreements;
                    $scope.loaders.toActivate = false;
                }, angular.noop, (contract) => {
                    $scope.toActivate.push(contract);
                    $scope.agreed[contract.id] = false;
                });
        };

        $scope.accept = function (id) {
            $scope.loaders[`accept_${id}`] = true;

            return OvhApiMe.Agreements().v6()
                .accept({ id }, {}).$promise
                .then(() => {
                    $scope.getToValidate();
                    $scope.$broadcast("paginationServerSide.reload", "agreementsList");
                })
                .catch((d) => Alerter.set("alert alert-danger", d, d, "agreements_alerter"));
        };

        $scope.resetMessages = function () {
            Alerter.resetMessage("agreements_alerter");
        };
    });
