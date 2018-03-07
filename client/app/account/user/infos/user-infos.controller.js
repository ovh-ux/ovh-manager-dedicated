angular.module("UserAccount.controllers").controller("UserAccount.controllers.Infos", [
    "$scope",
    "$q",
    "$location",
    "UserAccount.services.Infos",
    "CountryConstants",
    "Alerter",
    "constants",

    function ($scope, $q, $location, UseraccountInfos, countryConstants, Alerter, constants) {
        "use strict";

        /* Be carefull, a part of this controller is url driven.
         * See the bottom of this file for more detail */
        let searchParams;

        $scope.loading = false;
        $scope.loadCreationRules = false;
        $scope.dateFormat = "yyyy/MM/dd";

        $scope.alerts = {
            dashboardInfos: "useraccount.alerts.dashboardInfos"
        };

        $scope.controls = {
            legalforms: ["association", "corporation", "administration", "individual", "other"],
            taskEmailChangesTodo: null,
            validateEmailChange: null,
            countries: null
        };

        $scope.worldPart = constants.target;
        $scope.user = null;

        function loadUserInfos () {
            $scope.loading = true;

            let promise = UseraccountInfos.getMeModels().then((model) => {
                const props = model["nichandle.Nichandle"].properties;
                const readOnlyProperties = [];
                for (const key in props) {
                    if (props[key].readOnly) {
                        readOnlyProperties.push(key);
                    }
                }
                $scope.readOnlyProperties = readOnlyProperties;
            });

            promise = promise.then(() => UseraccountInfos.getListOfRulesFieldName());

            promise
                .then((fieldNames) =>
                    UseraccountInfos.getUseraccountInfos().then((response) => {
                        // pick attributes that belong to /rules
                        // add customer code since it will be displayed in the form
                        $scope.user = _.pick(response, fieldNames.concat("customerCode"));

                        // remove empty attributes
                        $scope.user = _.pick($scope.user, _.identity);

                        // juste in case birthday date is retrieved in legacy format
                        // we nullify it so we don't break the first call to /rules
                        if (!moment($scope.user.birthDay, "YYYY-MM-DD").isValid() || /\//.test($scope.user.birthDay)) {
                            delete $scope.user.birthDay;
                        }
                    })
                )
                .catch((err) => {
                    Alerter.alertFromSWS($scope.tr("user_account_info_error"), err.data, "InfoAlert");
                })
                .finally(() => {
                    $scope.loading = false;
                });

            $scope.controls.taskEmailChangeTodo = null;
            UseraccountInfos.taskEmailChanges("todo").then(
                (taskIds) => {
                    if (taskIds && taskIds.length > 0) {
                        // get only for the last
                        UseraccountInfos.taskEmailChange(taskIds.slice(-1)).then(
                            (task) => {
                                if (task && task.state === "todo") {
                                    $scope.controls.taskEmailChangeTodo = task;
                                }
                            },
                            (err) => {
                                Alerter.alertFromSWS($scope.tr("user_account_info_error"), err.data, "InfoAlert");
                            }
                        );
                    }
                },
                (err) => {
                    Alerter.alertFromSWS($scope.tr("user_account_info_error"), err.data, "InfoAlert");
                }
            );
        }

        $scope.onProfileUpdate = function () {
            $scope.user = null;
            loadUserInfos();
        };

        $scope.resetInfoView = function () {
            $location.search("validateEmailChange", null);
            $location.search("taskId", null);
            $location.search("token", null);

            // ui-router quickwin : $location doesnt reload anymore
            // so we update the scope directly
            $scope.controls.validateEmailChange = null;
            loadUserInfos();
        };

        $scope.cancel = function () {
            $scope.edit = false;
        };

        function loadTaskForEmailValidation (taskId) {
            UseraccountInfos.taskEmailChange(taskId).then(
                (task) => {
                    if (!task) {
                        return Alerter.alertFromSWS($scope.tr("user_account_info_error"), new Error("task not found."), "InfoAlert");
                    }

                    $scope.controls.validateEmailChange.data = task;

                    if (task.state !== "todo") {
                        $scope.controls.validateEmailChange.error = true;
                        switch (task.state) {
                        case "done":
                            Alerter.alertFromSWS($scope.tr("user_account_email_token_already_accepted"), null, "InfoAlert");
                            break;
                        case "refused":
                            Alerter.alertFromSWS($scope.tr("user_account_email_token_already_refused"), null, "InfoAlert");
                            break;
                        default:
                            Alerter.alertFromSWS($scope.tr("user_account_email_token_expired"), null, "InfoAlert");
                            break;
                        }
                    }
                    return task;
                },
                (err) => {
                    Alerter.alertFromSWS($scope.tr("user_account_info_error"), err.data, "InfoAlert");
                }
            );
        }

        function acceptOrRefuseEmailSuccess () {
            $scope.resetInfoView();
        }

        function acceptOrRefuseEmailError (err) {
            Alerter.alertFromSWS($scope.tr("user_account_info_error"), err.data, "InfoAlert");
            $scope.controls.validateEmailChange.loading = false;
        }

        function acceptOrRefuseEmail (accept) {
            Alerter.resetMessage("InfoAlert");
            $scope.controls.validateEmailChange.loading = true;

            if (accept) {
                UseraccountInfos.taskEmailChangeAccept($scope.controls.validateEmailChange.data.id, $scope.controls.validateEmailChange.token).then(acceptOrRefuseEmailSuccess, acceptOrRefuseEmailError);
            } else {
                UseraccountInfos.taskEmailChangeRefuse($scope.controls.validateEmailChange.data.id, $scope.controls.validateEmailChange.token).then(acceptOrRefuseEmailSuccess, acceptOrRefuseEmailError);
            }
        }

        $scope.acceptEmail = function () {
            acceptOrRefuseEmail(true);
        };

        $scope.refuseEmail = function () {
            acceptOrRefuseEmail();
        };

        $scope.validateTaskWithToken = function () {
            $location.search({
                validateEmailChange: "true", // string not boolean
                taskId: $scope.controls.taskEmailChangeTodo.id
            });

            // ui-router quickwin : $location doesnt reload anymore
            // so we update the scope directly
            searchParams = $location.search();
            $scope.controls.validateEmailChange = {
                error: false,
                loading: false,
                taskId: searchParams.taskId,
                token: searchParams.token
            };
            loadTaskForEmailValidation($scope.controls.validateEmailChange.taskId);
        };

        $scope.isMandatory = function (field) {
            return $scope.edit && $scope.creationRules[field].mandatory;
        };

        $scope.getRegexp = function (field) {
            let pattern = "";
            if ($scope.edit && $scope.creationRules[field].regularExpression) {
                pattern = $scope.creationRules[field].regularExpression;
            }
            return pattern;
        };

        $scope.getInputClass = function (field) {
            let accountField;

            if ($scope.edit) {
                accountField = $scope.myAccountForm[field];
                if (accountField.$dirty) {
                    if (accountField.$valid) {
                        return "success";
                    }
                    if (accountField.$invalid) {
                        return "error";
                    }
                }
            }

            return "";
        };

        /* The url is watched to switch between the main view and the validation/refuse
         * of the master email view */
        searchParams = $location.search();
        if (searchParams.taskId && searchParams.validateEmailChange === "true") {
            $scope.controls.validateEmailChange = {
                error: false,
                loading: false,
                taskId: searchParams.taskId,
                token: searchParams.token
            };
            loadTaskForEmailValidation($scope.controls.validateEmailChange.taskId);
        } else {
            loadUserInfos();
        }
    }
]);
