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

    // ui router modal layout definition
    .run(($stateRegistry, $urlService) => {
        /**
         *  As initial URL synchronization is delayed we can check all modal layout states and check if toChilds attribute is setted. For these states we will need to create new states as follow:
         *  We will take the direct parent of the modal layout state and create new states with the same layout configuration to all of its child states.
         */
        const layoutStates = _.filter($stateRegistry.states, ({ layout }) => _.get(layout, "toChilds") === true || _.size(layout, "toChilds", []));
        const getChildStates = (parentStateName) => _.filter($stateRegistry.states, ({ name }) => _.startsWith(name, `${parentStateName}.`));

        layoutStates.forEach((layoutState) => {
            let childStates;

            // build child states that need modal layout applied
            if (angular.isArray(layoutState.layout.toChilds)) {
                childStates = layoutState.layout.toChilds;
            } else {
                childStates = _.map(getChildStates(layoutState.parent.name), "name");
            }

            // build child states that need to be ignored
            // 1st: all child states of each states that need to be ignored
            // 2nd: current layout state doesn't need to have itself as modal child
            layoutState.layout.ignoreChilds.forEach((childState) => {
                layoutState.layout.ignoreChilds = layoutState.layout.ignoreChilds.concat(_.map(getChildStates(childState), "name"));
            });
            layoutState.layout.ignoreChilds.push(layoutState.name);

            // remove child states that need to be ignored
            childStates = _.xor(childStates, layoutState.layout.ignoreChilds);

            // create child state with layout settings applied
            const modalSateSuffix = _.last(layoutState.name.split("."));
            childStates.forEach((childState) => {
                $stateRegistry.register({
                    name: `${childState}.${modalSateSuffix}`,
                    url: layoutState.self.url,
                    templateUrl: layoutState.self.templateUrl,
                    controller: layoutState.self.controller,
                    layout: { // don't know why full config must be defined???
                        name: "modal",
                        toChilds: false,
                        ignoreChilds: []
                    }
                });
            });
        });

        $urlService.listen(); // Start responding to URL changes
        $urlService.sync(); // Find the matching URL and invoke the handler
    })
    .config(($urlServiceProvider, $stateProvider, $transitionsProvider) => {
        let modalInstance = null;

        /**
         *  Delay initial URL synchronization.
         *  As we will create some states later (at run phase), maybe the url we want to access is not yet configured. So wait a moment that all states are declared (at config phase) and re-launch the URL sync later.
         */
        $urlServiceProvider.deferIntercept();

        /**
         *  Create a decorator for our new state attribute 'layout'.
         *  For modal layout, the attribute can be a string or an object:
         *  - if string - value must be 'modal'
         *  - if object - avaiable attributes are:
         *      - name: the value must be 'modal'.
         *      - toChilds (default value: 'false'):
         *          - can be a boolean: 'true' to declare the modal state to all direct parent childs.
         *          - or an array of string that contains the childs of the direct parents where the modal needs to be displayed.
         *      - ignoreChilds: an array of string that contains states names where the modal state doesn't need to be displayed.
         */
        $stateProvider.decorator("layout", (state) => {
            let modalLayout;

            if (_.get(state, "self.layout") === "modal" || _.get(state, "self.layout.name") === "modal") {
                modalLayout = {
                    name: "modal",
                    toChilds: state.self.layout.toChilds || false,
                    ignoreChilds: state.self.layout.ignoreChilds || []
                };
            }

            return modalLayout;
        });

        /**
         *  Use onSuccess hook to manage the modal display.
         */
        $transitionsProvider.onSuccess({}, (transition) => {
            transition.promise.finally(() => {
                const state = transition.to();

                // close previous modal
                if (modalInstance) {
                    modalInstance.close();
                }

                if (_.get(state, "layout.name") === "modal") {
                    const $state = transition.injector().get("$state");
                    const $uibModal = transition.injector().get("$uibModal");

                    modalInstance = $uibModal.open({
                        templateUrl: state.templateUrl,
                        controller: state.controller,
                        controllerAs: state.controllerAs || "$ctrl"
                    });

                    // if backdrop is clicked - be sure to close the modal
                    modalInstance.result.catch(() => $state.go("^"));
                }
            });
        });
    })
    .config(($transitionsProvider, $httpProvider) => {
        $httpProvider.interceptors.push("translateInterceptor");

        /*
            Translations loading from ui state resolve
         */
        $transitionsProvider.onBefore({}, (transition) => {
            transition.addResolvable({
                token: "translations",
                deps: ["$translate", "$translatePartialLoader"],
                resolveFn: ($translate, $translatePartialLoader) => {
                    const state = transition.to();

                    if (state.translations) {

                        const templateUrlTab = [];
                        let translationsTab = state.translations;

                        if (state.views) {
                            angular.forEach(state.views, (value) => {

                                if (_.isUndefined(value.noTranslations) && !value.noTranslations) {
                                    if (value.templateUrl) {
                                        templateUrlTab.push(value.templateUrl);
                                    }
                                    if (value.translations) {
                                        translationsTab = _.union(translationsTab, value.translations);
                                    }
                                }

                            });
                        }

                        angular.forEach(templateUrlTab, (templateUrl) => {
                            let routeTmp = templateUrl.substring(templateUrl.indexOf("/") + 1, templateUrl.lastIndexOf("/"));
                            let index = routeTmp.lastIndexOf("/");

                            while (index > 0) {
                                translationsTab.push(routeTmp);
                                routeTmp = routeTmp.substring(0, index);
                                index = routeTmp.lastIndexOf("/");
                            }

                            translationsTab.push(routeTmp);
                        });

                        // mmmhhh... It seems that we have to refresh after each time a part is added

                        translationsTab = _.uniq(translationsTab);

                        // load translation parts
                        angular.forEach(translationsTab, (part) => {
                            $translatePartialLoader.addPart(part);
                        });

                        return $translate.refresh();
                    }

                    return null;
                }
            });
        });
    })
    .config([
        "$qProvider",
        function ($qProvider) {
            "use strict";
            $qProvider.errorOnUnhandledRejections(false);
        }
    ])
    .constant("UNIVERSE", "DEDICATED");
