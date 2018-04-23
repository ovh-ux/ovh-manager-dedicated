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
        const layoutStates = _.filter($stateRegistry.states, ({ layout }) => _.get(layout, "toChilds") === true || _.size(_.get(layout, "toChilds", [])));
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
                const state = transition.$to();

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

        const getStateTranslationParts = (state) => {
            if (!state.translations) {
                return [];
            }
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

            translationsTab = _.uniq(translationsTab);
            return translationsTab;
        };

        /*
            Translations loading from ui state resolve
         */
        $transitionsProvider.onBefore({}, (transition) => {
            transition.addResolvable({
                token: "translations",
                deps: ["$translate", "$translatePartialLoader", "$state"],
                resolveFn: ($translate, $translatePartialLoader, $state) => {
                    const state = transition.to();
                    const stateParts = state.name.match(/[^\.]+/g);
                    const stateList = [];
                    let stateName = "";

                    angular.forEach(stateParts, (part) => {
                        stateName = stateName ? `${stateName}.${part}` : part;
                        stateList.push(stateName);
                    });

                    angular.forEach(stateList, (stateElt) => {
                        const translations = getStateTranslationParts($state.get(stateElt));
                        angular.forEach(translations, (part) => {
                            $translatePartialLoader.addPart(part);
                        });
                    });

                    return $translate.refresh();
                }
            });
        });
    })
    .config(($qProvider) => {
        $qProvider.errorOnUnhandledRejections(false);
    })
    .config((OtrsPopupProvider, constants) => {
        OtrsPopupProvider.setBaseUrlTickets(_.get(constants, "REDIRECT_URLS.listTicket", null));
    })
    .constant("UNIVERSE", "DEDICATED");
