angular.module("App").config(($stateProvider) => {
    $stateProvider.state("app.dedicated.housing", {
        url: "/configuration/housing/:productId",
        templateUrl: "dedicated/housing/dedicated-housing.html",
        controller: "HousingCtrl",
        resolve: {
            translator: [
                "translator",
                function (translator) {
                    return translator.load(["housing"]).then(() => translator);
                }
            ]
        }
    });
});
