angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.networks.cdn.dedicated.backend", {
        url: "/backend",
        "abstract": true,
        views: {
            cdnMainView: {
                template: "<div data-ui-view=''></div>"
            }
        }
    });
});
