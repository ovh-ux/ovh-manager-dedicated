angular.module("App").controller("DedicatedCloudSecurityCtrl", function ($rootScope, $stateParams, $scope, DedicatedCloud, translator) {
    const self = this;
    let forceRefresh = false;

    $scope.policies = {
        model: null,
        info: null
    };
    $scope.policySearchSelected = null;

    $scope.selectedPolicies = [];

    $scope.loaders = {
        table: false,
        search: false,
        policiesInfo: true
    };

    $scope.$on("dedicatedCloud.tabs.policy.info.refresh", () => {
        $scope.policies.info = null;
        $scope.loadInfo();
    });

    $scope.$on("dedicatedCloud.tabs.policy.info.refreshaccess", () => {
        $scope.$broadcast("dedicatedCloud.tabs.policy.info.refresh");
        $rootScope.$broadcast("dedicatedcloud.informations.reload");
    });

    $scope.loadInfo = function () {
        $scope.loaders.policiesInfo = true;

        DedicatedCloud.getSecurityInformations($stateParams.productId).then(
            (informations) => {
                $scope.policies.info = informations;
                $scope.loaders.policiesInfo = false;
            },
            (data) => {
                $scope.loaders.policiesInfo = false;
                $scope.setMessage($scope.tr("dedicatedCloud_dashboard_loading_error"), { type: "ERROR", message: data.message });
            }
        );
    };

    $scope.loadPaginated = function (count, offset) {
        $scope.loaders.search = true;
        $scope.loaders.table = true;

        DedicatedCloud.getSecurityPolicies($stateParams.productId, count, offset, forceRefresh)
            .then((paginatedPolicies) => {
                forceRefresh = false;
                $scope.loaders.table = false;
                $scope.policies.model = paginatedPolicies;
            }, self.onError)
            .then(self.endRequest);
    };

    $scope.$watch("selectedPolicies.length", () => {
        initSelection();
    });

    function initSelection () {
        if ($scope.policies && $scope.policies.model && $scope.policies.model.list && $scope.policies.model.list.results) {
            let i = 0;
            let l;
            for (i, l = $scope.policies.model.list.results.length; i < l; i++) {
                if (~$scope.selectedPolicies.indexOf($scope.policies.model.list.results[i].id)) {
                    $scope.policies.model.list.results[i].selected = true;
                } else {
                    $scope.policies.model.list.results[i].selected = false;
                }
            }
        }
    }

    $scope.$on("dedicatedCloud.tabs.policy.refresh", () => {
        $scope.selectedPolicies = [];
        self.reloadCurrentPage();
    });

    self.reloadCurrentPage = function () {
        if (!$scope.loaders.table) {
            forceRefresh = true;
            $scope.$broadcast("paginationServerSide.reload");
        }
    };

    $scope.globalCheckboxPoliciesStateChange = function (state) {
        if ($scope.policies && $scope.policies.model && $scope.policies.model.list && $scope.policies.model.list.results) {
            let i = 0;
            let l;
            switch (state) {
            case 0:
                $scope.selectedPolicies = [];
                break;
            case 1:
                for (i, l = $scope.policies.model.list.results.length; i < l; i++) {
                    if (!~$scope.selectedPolicies.indexOf($scope.policies.model.list.results[i].id)) {
                        $scope.selectedPolicies.push($scope.policies.model.list.results[i].id);
                    }
                }
                break;
            case 2:
                for (i, l = $scope.policies.model.fullNetworksList.length; i < l; i++) {
                    if (!~$scope.selectedPolicies.indexOf($scope.policies.model.fullNetworksList[i])) {
                        $scope.selectedPolicies.push($scope.policies.model.fullNetworksList[i]);
                    }
                }
                break;
            default:
                break;
            }
        }
    };

    $scope.togglePolicy = function (entry) {
        const index = $scope.selectedPolicies.indexOf(entry);
        if (~index) {
            $scope.selectedPolicies.splice(index, 1);
        } else {
            $scope.selectedPolicies.push(entry);
        }
    };

    self.endRequest = function () {
        $scope.loaders.table = false;
        $scope.loaders.search = false;
    };

    self.onError = function (data) {
        $scope.setMessage(translator.tr("dedicatedCloud_dashboard_loading_error"), data.data);
    };

    $scope.loadInfo();
});
