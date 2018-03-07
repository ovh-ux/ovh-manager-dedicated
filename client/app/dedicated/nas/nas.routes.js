angular.module("App").config(($stateProvider) => {

    const translatorResolve = (translator) => translator.load(["nas"]).then(() => translator);

    $stateProvider.state("app.networks.nas", {
        url: "/nas",
        templateUrl: "dedicated/nas/nas.html",
        controller: "NasCtrl",
        "abstract": true,
        reloadOnSearch: false,
        resolve: {
            translator: translatorResolve
        }
    });

});
