angular
    .module("App")
    .factory("serviceTypeInterceptor", () => ({
        request (config) {
            if (/^(\/?engine\/)?2api(\-m)?\//.test(config.url)) {
                config.url = config.url.replace(/^(\/?engine\/)?2api(\-m)?/, "");
                config.serviceType = "aapi";
            }

            if (/^apiv6\//.test(config.url)) {
                config.url = config.url.replace(/^apiv6/, "");
                config.serviceType = "apiv6";
            }

            if (/^apiv7\//.test(config.url)) {
                config.url = config.url.replace(/^apiv7/, "");
                config.serviceType = "apiv7";
            }

            return config;
        }
    }))
    .config([
        "ovh-proxy-request.proxyProvider",
        (proxy) => {
            proxy.proxy("$http");
            proxy.pathPrefix("apiv6");
        }
    ])
    .config((ssoAuthenticationProvider, $httpProvider, constants) => {
        ssoAuthenticationProvider.setLoginUrl(constants.loginUrl);
        ssoAuthenticationProvider.setLogoutUrl(`${constants.loginUrl}?action=disconnect`);

        if (!constants.prodMode) {
            ssoAuthenticationProvider.setUserUrl("engine/apiv6/me");
        }

        ssoAuthenticationProvider.setConfig([
            {
                serviceType: "apiv6",
                urlPrefix: constants.prodMode ? "/engine/apiv6" : "engine/apiv6"
            },
            {
                serviceType: "aapi",
                urlPrefix: constants.prodMode ? "/engine/2api" : "engine/2api"
            },
            {
                serviceType: "apiv7",
                urlPrefix: constants.prodMode ? "/engine/apiv7" : "engine/apiv7"
            }
        ]);

        $httpProvider.interceptors.push("serviceTypeInterceptor");
        $httpProvider.interceptors.push("ssoAuthInterceptor");
    })
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
    .config((LANGUAGES, translatorProvider) => {
        translatorProvider.setAvailableLanguages(LANGUAGES);
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
    .constant("FIREWALL_RULE_ACTIONS", {
        ALLOW: "PERMIT",
        DENY: "DENY"
    })
    .constant("FIREWALL_RULE_PROTOCOLS", {
        IPV_4: "IPv4",
        UDP: "UDP",
        TCP: "TCP",
        ICMP: "ICMP"
    })
    .constant("FIREWALL_STATUSES", {
        ACTIVATED: "ACTIVATED",
        DEACTIVATED: "DEACTIVATED",
        NOT_CONFIGURED: "NOT_CONFIGURED"
    })
    .constant("MITIGATION_STATUSES", {
        ACTIVATED: "ACTIVATED",
        AUTO: "AUTO",
        FORCED: "FORCED"
    })
    .constant("STATISTICS_SCALE", {
        TENSECS: "_10_S",
        ONEMIN: "_1_M",
        FIVEMINS: "_5_M"
    })
    .constant("TASK_STATUS", {
        CANCELLED: "CANCELLED",
        CUSTOMER_ERROR: "CUSTOMER_ERROR",
        DOING: "DOING",
        DONE: "DONE",
        INIT: "INIT",
        OVH_ERROR: "OVH_ERROR",
        TODO: "TODO"
    })
    .config((BillingVantivConfiguratorProvider, BILLING_VANTIV) => {
        BillingVantivConfiguratorProvider.setScriptUrl(BILLING_VANTIV.SCRIPTS.PROD);
    })
    .run((ssoAuthentication, User) => {
        ssoAuthentication.login().then(() => User.getUser());
    })
    .run(($rootScope, constants) => {
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
    .run((translator) => {
        translator.load(["core", "doubleAuth", "components", "user-contracts"]);
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
    .config(($httpProvider) => {
        $httpProvider.interceptors.push("translateInterceptor");
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
        $translateProvider.useSanitizeValueStrategy("sanitizeParameters");

        $translateProvider.preferredLanguage(defaultLanguage);
        $translateProvider.use(defaultLanguage);
        $translateProvider.fallbackLanguage("fr_FR");
    })
    .config([
        "$qProvider",
        function ($qProvider) {
            "use strict";
            $qProvider.errorOnUnhandledRejections(false);
        }
    ])
    .config((OtrsPopupProvider, constants) => {
        OtrsPopupProvider.setBaseUrlTickets(_.get(constants, "REDIRECT_URLS.listTicket", null));
    })
    .constant("UNIVERSE", "DEDICATED");
