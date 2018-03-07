angular.module("ovhSignupApp").component("newAccountForm", {
    bindings: {
        model: "<",
        readonly: "<",
        onSubmit: "&", // on create callback
        onCancel: "&" // on cancel callback
    },
    template: '<div data-ng-include="getTemplateUrl()"></div>',
    controller: [
        "$scope",
        "$q",
        "$location",
        "$http",
        "$httpParamSerializerJQLike",
        "$timeout",
        "NewAccountFormConfig",
        "Alerter",
        "UserAccount.conf.BASE_URL",
        "UserAccount.constants",
        "UserAccount.services.Infos",
        "translator",

        function ($scope, $q, $location, $http, $httpParamSerializerJQLike, $timeout, NewAccountFormConfig, Alerter, BASE_URL, UserAccountConstants, UserAccountServiceInfos, translator) {
            "use strict";

            this.isLoading = false; // true when fetching data from api
            this.initError = null; // initialization error if any
            this.submitError = null;
            this.model = this.model || {}; // form model
            this.readonly = this.readonly || [];
            this.rules = null;
            this.isSubmitting = false;

            // because i'm cheap and lazy
            const $translate = {
                instant: translator.tr
            };
            this.tr = $translate.instant;

            $scope.getTemplateUrl = () => `${BASE_URL}components/newAccountForm/new-account-form-component.html`;

            this.$onInit = () => {
                // backup of original model
                this.originalModel = angular.copy(this.model);

                this.loaded = false;
                return $q
                    .all({
                        rules: this.fetchRules(this.model)
                    })
                    .then((result) => {
                        this.rules = result.rules;
                        this.loaded = true;
                    })
                    .catch((err) => {
                        this.initError = _.get(err, "data.message") || _.get(err, "message") || err;
                    });
            };

            // initialize rules with /me data
            this.initializeRulesWithOriginalModel = (rules) => {
                _.each(this.originalModel, (value, key) => {
                    const rule = _.find(rules, { fieldName: key });
                    if (rule) {
                        rule.initialValue = value;
                    }
                });
                return rules;
            };

            // return the list of rules from api
            this.fetchRules = (_params) => {
                let params = _params;
                const customerCode = params.customerCode;

                // we don't want to send attributes outside of /rules
                if (this.rules) {
                    params = _.pick(this.model, _.pluck(this.rules, "fieldName"));
                }

                // customer code does not belong to /rules, only displayed in the form
                params = _.omit(params, "customerCode");

                this.isLoading = true;
                return $http
                    .post(`${UserAccountConstants.swsProxyRootPath}newAccount/rules`, params)
                    .then((result) => {
                        if (result.status === 200) {
                            // hide rules that are not editable
                            _.each(result.data, (rule) => {
                                // email is a special custom case, it is editable
                                if (rule.fieldName === "email") {
                                    rule.readonly = false;
                                } else {
                                    // rule is editable if not in the readonly list of fields
                                    rule.readonly = this.readonly.indexOf(rule.fieldName) >= 0;
                                }
                            });
                            return result.data;
                        }
                        return $q.reject(result);
                    })
                    .then(this.initializeRulesWithOriginalModel)
                    .then((rules) => {
                        // customer code does not belong to /rules, only displayed in the form
                        rules.unshift({
                            fieldName: "customerCode",
                            mandatory: true,
                            initialValue: customerCode || "-"
                        });
                        return rules;
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            };

            // on form submit callback
            this.submit = () => {
                this.isSubmitting = true;
                this.submitError = null;

                // we don't want to send attributes outside of /rules
                let model = _.pick(this.model, _.pluck(this.rules, "fieldName"));

                // we need to blank out some values for api to be happy
                _.each(_.keys(this.originalModel), (field) => {
                    // attributes not in /rules and not readonly are blanked out
                    if (!_.find(this.rules, { fieldName: field }) && this.readonly.indexOf(field) < 0) {
                        model[field] = null;
                    }
                });

                // nullify empty values
                _.each(model, (value, key) => {
                    if (!model[key]) {
                        model[key] = null;
                    }
                });

                // customer code does not belong to /rules, only displayed in the form
                model = _.omit(model, "customerCode");

                // put on /me does not handle email modification
                model = _.omit(model, "email");

                let promise = $http.put(`${UserAccountConstants.swsProxyRootPath}me`, model).then((result) => {
                    if (result.status !== 200) {
                        return $q.reject(result);
                    }
                    return result;
                });

                if (this.originalModel.email !== this.model.email) {
                    promise = promise.then(() => UserAccountServiceInfos.changeEmail(this.model.email)).then(() =>

                        // add some delay for task creation
                        $timeout(angular.noop, 3000)
                    );
                }

                return promise
                    .then(() => {
                        if (this.onSubmit) {
                            this.onSubmit();
                        }
                    })
                    .catch((err) => {
                        this.submitError = err;
                        Alerter.alertFromSWS(
                            $translate.instant("user_account_info_error"),
                            {
                                type: "ERROR",
                                message: _.get(err, "data.message")
                            },
                            "InfoErrors"
                        );
                    })
                    .finally(() => {
                        this.isSubmitting = false;
                    });
            };

            this.cancel = () => {
                if (this.onCancel) {
                    this.onCancel();
                }
            };

            // return the list of form fieldsets
            this.getSections = () => _.keys(NewAccountFormConfig.sections);

            // return the list of fields for a given fieldset name
            // readonly rules are not returned because they are not editable
            this.getRulesBySection = (section) => {
                // special section to handle fields that does not belong to any section
                if (section === "other") {
                    return _.filter(this.rules, (rule) => {
                        const allFields = _.flatten(_.values(NewAccountFormConfig.sections));
                        return _.indexOf(allFields, rule.fieldName) < 0 && !rule.readonly;
                    });
                }

                const fields = NewAccountFormConfig.sections[section];
                return _.filter(this.rules, (rule) => _.indexOf(fields, rule.fieldName) >= 0 && !rule.readonly);
            };

            // return the section of a given rule
            this.getSectionOfRule = (rule) => {
                let found = null;
                _.each(NewAccountFormConfig.sections, (fieldNames, section) => {
                    if (!found && _.indexOf(fieldNames, rule.fieldName) >= 0) {
                        found = section;
                    }
                });
                return found || "other";
            };

            this.updateRules = () =>
                this.fetchRules(this.model).then((newRules) => {
                    _.each(this.rules, (rule) => {
                        if (!_.find(newRules, { fieldName: rule.fieldName })) {
                            delete this.model[rule.fieldName];
                        }
                    });
                    this.rules = newRules;
                });

            // callback for when user changed a form field value
            this.onFieldChange = (rule, value) => {
                if (value !== this.model[rule.fieldName]) {
                    // update model
                    this.model[rule.fieldName] = value;

                    this.updateRules();
                }
            };

            // compare original model to edited model
            this.hasChanges = () => !angular.equals(this.originalModel, this.model);
        }
    ]
});
