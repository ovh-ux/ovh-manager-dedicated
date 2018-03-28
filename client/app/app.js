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

    .config(($urlRouterProvider) => {
        $urlRouterProvider.otherwise("/configuration");
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
    .config(($transitionsProvider, $httpProvider) => {
        $httpProvider.interceptors.push("translateInterceptor");

        /*
            Modal management - 2 ways to declare a modal:
            1)  create a state with attribute 'layout' setted to value 'modal'. For example :
                ```
                $stateProvider.state("app.myModalState", {
                    url: "/myModal",
                    templateUrl: "/path/to/modal/html"
                    controller: "modalCtrl"
                });
                ```
                This method can be used when there is no child states that needs to display the modal.

            2)  The problem with solution one is that if direct parent state (of the modal state) and child states (of the parent state) need to display the same modal, if you try to access the modal state url from a child,
                you will be redirect to the parent and the view behind the modal will be the view of the parent (not of the current child).
                To avoid this problem, you can:
                - add the optional `modal` query param to the url of the parent scope;
                - define the configuration of your modals into a resolve callback ('modalConfigurations') of your state.
                For example:
                ```
                $stateProvider.state("app.parentState", {
                    url: "/parentPath?modal",
                    ...
                    resolve: {
                        modalConfigurations () {
                            return {
                                "myModal": {
                                    templateUrl: "/path/to/modal/html",
                                    controller: "modalCtrl"
                                }
                            };
                        }
                    }
                });
                ```
                Like this you will be abble to display the modal from your parent AND from your child states without break the views behind the modal.
         */

        let modalInstance = null;
        $transitionsProvider.onSuccess({}, (transition) => {
            transition.promise.finally(() => {
                const state = transition.to();
                const $state = transition.injector().get("$state");
                const $stateParams = transition.injector().get("$stateParams");
                const $uibModal = transition.injector().get("$uibModal");

                let modalConfiguration;
                let modalPromiseCatch = () => $state.go("^");

                // close previous modal
                if (modalInstance) {
                    modalInstance.close();
                }

                if (state.layout === "modal") { // first way
                    modalConfiguration = {
                        templateUrl: state.templateUrl,
                        controller: state.controller,
                        controllerAs: state.controllerAs || "$ctrl"
                    };
                } else if ($stateParams.modal) { // second way
                    const modalConfigurationsResolve = _.find($state.$current.resolvables, { token: "modalConfigurations" }) || _.find($state.$current.parent.resolvables, { token: "modalConfigurations" });

                    if (modalConfigurationsResolve) {
                        modalConfiguration = _.get(modalConfigurationsResolve.resolveFn(), $stateParams.modal);
                        if (modalConfiguration) {
                            modalConfiguration = angular.extend({
                                controllerAs: "$ctrl"
                            }, modalConfiguration);

                            modalPromiseCatch = () => $state.go($state.current.name, { modal: null }, { reload: false });
                        }
                    }
                }

                // display the modal
                if (modalConfiguration) {
                    modalInstance = $uibModal.open(modalConfiguration);

                    // if backdrop is clicked - be sure to close the modal (by going to previous state or by setting modal param to null)
                    modalInstance.result.catch(modalPromiseCatch);
                }
            });
        });

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
