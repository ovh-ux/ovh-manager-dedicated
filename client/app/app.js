angular
    .module("App")
    .config([
        "ovh-proxy-request.proxyProvider",
        (proxy) => {
            proxy.proxy("$http");
            proxy.pathPrefix("apiv6");
        }
    ])
    .config(($locationProvider) => {
        $locationProvider.hashPrefix("");
    })
    .config((tmhDynamicLocaleProvider) => {
        tmhDynamicLocaleProvider.localeLocationPattern("resources/angular/i18n/angular-locale_{{locale}}.js");
    })
    .config((OvhHttpProvider, constants) => {
        OvhHttpProvider.rootPath = constants.swsProxyPath;
        OvhHttpProvider.clearCacheVerb = ["POST", "PUT", "DELETE"];
        OvhHttpProvider.returnSuccessKey = "data"; // By default, request return response.data
        OvhHttpProvider.returnErrorKey = "data"; // By default, request return error.data
    })
    .config(($urlServiceProvider) => {
        $urlServiceProvider.rules.otherwise("/configuration");
    })

    /*= ========= AT-INTERNET ========== */
    .config((atInternetProvider, atInternetUiRouterPluginProvider, constants) => {
        const level2 = constants.target === "US" ? "57" : "3";

        atInternetProvider.setEnabled(constants.prodMode && window.location.port.length <= 3);
        atInternetProvider.setDebug(!constants.prodMode);

        atInternetProvider.setDefaults({
            level2
        });

        atInternetUiRouterPluginProvider.setTrackStateChange(constants.prodMode && window.location.port.length <= 3);
        atInternetUiRouterPluginProvider.addStateNameFilter((routeName) => routeName ? routeName.replace(/^app/, "dedicated").replace(/\./g, "::") : "");
    })
    .constant("REGEX", {
        ROUTABLE_BLOCK: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(\d|[1-2]\d|3[0-2]))$/,
        ROUTABLE_IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        ROUTABLE_BLOCK_OR_IP: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\/(\d|[1-2]\d|3[0-2]))?$/
    })
    .config((BillingVantivConfiguratorProvider, BILLING_VANTIV) => {
        BillingVantivConfiguratorProvider.setScriptUrl(BILLING_VANTIV.SCRIPTS.PROD);
    })
    .run((ssoAuthentication, User) => {
        ssoAuthentication.login().then(() => User.getUser());
    })
    .run(($transitions, $rootScope, $state, constants) => {
        $rootScope.$on("$locationChangeStart", () => {
            delete $rootScope.isLeftMenuVisible;
        });

        // manage restriction on billing section for enterprise account
        // see src/billing/billingApp.js for resolve restriction on billing states
        $transitions.onError({}, (transition) => {
            const error = transition.error();
            if (_.get(error, "status") === 403 && _.get(error, "code") === "FORBIDDEN_BILLING_ACCESS") {
                $state.go("app.error", { error });
            }
        });

        $rootScope.worldPart = constants.target;
    })
    .run(($location) => {
        const queryParams = $location.search();

        if (queryParams && queryParams.redirectTo) {
            $location.path(queryParams.redirectTo);
            delete queryParams.redirectTo;
            $location.search(queryParams);
        }
    })
    .run((storage) => {
        storage.setKeyPrefix("com.ovh.univers.dedicated.");
    })
    .run((zendesk) => {
        zendesk.init();
    })
    .factory("translateInterceptor", ($q) => {
        const regexp = new RegExp(/Messages\w+\.json$/i);
        return {
            responseError (rejection) {
                if (regexp.test(rejection.config.url)) {
                    return {};
                }
                return $q.reject(rejection);
            }
        };
    })
    .factory("translateMissingTranslationHandler", ($sanitize) => function (translationId) {
        // Fix security issue: https://github.com/angular-translate/angular-translate/issues/1418
        return $sanitize(translationId);
    })
    .config((LANGUAGES, $translateProvider, constants) => {
        let defaultLanguage = "fr_FR";

        if (localStorage["univers-selected-language"]) {
            defaultLanguage = localStorage["univers-selected-language"];
        } else {
            localStorage["univers-selected-language"] = defaultLanguage;
        }

        $translateProvider.useLoader("$translatePartialLoader", {
            urlTemplate: constants.prodMode ? "{part}/translations/Messages_{lang}.json" : "client/app/{part}/translations/Messages_{lang}.json"
        });

        $translateProvider.useMissingTranslationHandler("translateMissingTranslationHandler");
        $translateProvider.useLoaderCache(true);
        $translateProvider.useSanitizeValueStrategy("escapeParameters");

        $translateProvider.preferredLanguage(defaultLanguage);
        $translateProvider.use(defaultLanguage);
        $translateProvider.fallbackLanguage("fr_FR");
    })
    .config(($transitionsProvider, $httpProvider) => {
        $httpProvider.interceptors.push("translateInterceptor");
    })
    .config(($qProvider) => {
        $qProvider.errorOnUnhandledRejections(false);
    })
    .config((OtrsPopupProvider, constants) => {
        OtrsPopupProvider.setBaseUrlTickets(_.get(constants, "REDIRECT_URLS.listTicket", null));
    })
    .run(($translate) => {
        moment.locale($translate.use().split("_")[0]);
    })
    .constant("UNIVERSE", "DEDICATED");
