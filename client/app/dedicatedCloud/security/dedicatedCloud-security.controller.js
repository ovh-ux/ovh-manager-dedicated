angular.module("App").controller("DedicatedCloudSecurityCtrl", function ($rootScope, $stateParams, $scope, $translate, DedicatedCloud, ouiDatagridService) {

    this.$onInit = () => {
        this.loading = false;
        this.policies = {
            info: null
        };

        $scope.$on("dedicatedCloud.tabs.policy.info.refresh", () => {
            this.policies.info = null;
            this.loadInfos();
        });

        $scope.$on("dedicatedCloud.tabs.policy.info.refreshaccess", () => {
            $scope.$broadcast("dedicatedCloud.tabs.policy.info.refresh");
            $rootScope.$broadcast("dedicatedcloud.informations.reload");
        });

        $scope.$on("dedicatedCloud.tabs.policy.refresh", () => {
            ouiDatagridService.refresh("pcc-security-datagrid", true);
        });

        return this.loadInfos();
    };

    this.loadInfos = () => {
        this.loading = true;
        return DedicatedCloud.getSecurityInformations(
            $stateParams.productId
        ).then((informations) => {
            this.policies.info = informations;
        }).catch((data) => {
            $scope.setMessage($translate.instant("dedicatedCloud_dashboard_loading_error"), { type: "ERROR", message: data.message });
        }).finally(() => {
            this.loading = false;
        });
    };

    this.loadPolicies = ({ offset, pageSize }) => DedicatedCloud.getSecurityPolicies(
        $stateParams.productId,
        offset - 1,
        offset - 1 + pageSize
    ).then((result) => ({
        data: _.get(result, "list.results"),
        meta: {
            totalCount: _.get(result, "fullNetworksList.length")
        }
    }));
});
