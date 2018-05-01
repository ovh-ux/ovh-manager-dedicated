angular
    .module("App")
    .config(($urlServiceProvider, $stateProvider, $transitionsProvider) => {

        // redirect to default location in case of undefined location target
        $urlServiceProvider.rules.otherwise("/configuration");

        /* ========================================================
        =            UI ROUTER MODAL LAYOUT DEFINITION            =
        ========================================================= */

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

        /* -----  End of UI ROUTER MODAL LAYOUT DEFINITION  ------ */

        /* =============================================
        =            TRANSLATION RESOLVABLE            =
        ============================================== */

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

        /* -----  End of TRANSLATION RESOLVABLE  ------ */

    })
    .run(($transitions, $state, $stateRegistry, $urlService) => {
        // manage restriction on billing section for enterprise account
        // see src/billing/billingApp.js for resolve restriction on billing states
        $transitions.onError({}, (transition) => {
            const error = transition.error();
            if (_.get(error, "status") === 403 && _.get(error, "code") === "FORBIDDEN_BILLING_ACCESS") {
                $state.go("app.error", { error });
            }
        });

        /* ========================================================
        =            UI ROUTER MODAL LAYOUT DEFINITION            =
        ========================================================= */

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

        /* -----  End of UI ROUTER MODAL LAYOUT DEFINITION  ------ */

    });
