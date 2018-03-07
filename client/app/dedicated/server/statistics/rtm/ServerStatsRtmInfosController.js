angular.module("controllers").controller("controllers.Server.Stats.Info", ($scope, $stateParams, Server) => {
    "use strict";

    $scope.loading = true;

    function init () {
        Server.getInfosServer($stateParams.productId).then((data) => {
            $scope.loading = false;
            $scope.infoRtm = data;
        });

        $scope.updateRtmLinkForCurrentLang = Server.getRtmHowtoUrl();
    }

    init();
});
