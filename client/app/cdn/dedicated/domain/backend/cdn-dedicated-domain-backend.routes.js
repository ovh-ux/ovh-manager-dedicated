angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.networks.cdn.dedicated.domain.backend", {
        url: "/backend",
        "abstract": true
    });
});
