angular.module("Module.search").config(($stateProvider) => {
    $stateProvider.state("app.search", {
        url: "/search",
        templateUrl: "search/search.html",
        controller: "SearchCtrl",
        controllerAs: "$ctrl",
        translations: ["search"]
    });
});
