angular.module("App").config(($stateProvider) => {

    // account module
    $stateProvider.state("app.error", {
        url: "/error",
        params: {
            error: null
        },
        views: {
            "app@": {
                templateUrl: "error/error.html",
                controller: "ErrorCtrl",
                controllerAs: "$ctrl"
            }
        },
        translations: ["error"]
    });
});
