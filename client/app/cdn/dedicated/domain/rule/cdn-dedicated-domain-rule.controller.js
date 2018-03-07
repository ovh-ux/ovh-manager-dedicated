angular.module("App").controller("CdnDomainTabCacheRuleCtrl", ($scope, $stateParams, $timeout, CdnDomain) => {
    $scope.loading = true;

    $scope.cacheRules = null;
    $scope.cacheRulesTableLoading = false;
    $scope.cacheRulesEntrySearchSelected = null;

    $scope.$watch(
        "cacheRulesEntrySearchSelected",
        (newValue) => {
            if ($scope.cacheRulesEntrySearchSelected !== null) {
                if ($scope.cacheRulesEntrySearchSelected === "") {
                    reloadCacheRules();
                } else {
                    $timeout(() => {
                        if ($scope.cacheRulesEntrySearchSelected === newValue) {
                            reloadCacheRules();
                        }
                    }, 500);
                }
            }
        },
        true
    );

    function reloadCacheRules () {
        $scope.$broadcast("paginationServerSide.reload");
    }

    $scope.loadCacheRules = function (cacheRuleCount, offset) {
        $scope.cacheRulesTableLoading = true;
        $scope.searchLoading = true;
        CdnDomain.getCacheRules($stateParams.productId, $stateParams.domain, cacheRuleCount, offset, $scope.cacheRulesEntrySearchSelected).then((cacheRules) => {
            $scope.cacheRules = cacheRules;
            $scope.loading = false;
            $scope.cacheRulesTableLoading = false;
            $scope.searchLoading = false;
        });
    };

    $scope.$on("cdn.domain.tabs.cacherule.refresh", () => {
        reloadCacheRules();
    });
});
