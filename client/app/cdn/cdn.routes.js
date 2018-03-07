angular.module("App").config(($stateProvider) => {

    const translatorResolve = (translator) => translator.load(["cdn"]).then(() => translator);

    $stateProvider.state("app.networks.cdn", {
        url: "",
        template: "<div data-ui-view></div>",
        "abstract": true,
        reloadOnSearch: false,
        resolve: {
            translator: translatorResolve
        }
    });

});
