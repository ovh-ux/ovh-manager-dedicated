angular
    .module("UserAccount")
    .controller("UserAccountAdvancedController", class UserAccountAdvancedController {
        constructor ($translate, Alerter, OvhApiMe, GITHUB_ORGANIZATION_URL, GITTER_URL) {
            this.$translate = $translate;
            this.Alerter = Alerter;
            this.OvhApiMe = OvhApiMe;
            this.GITHUB_ORGANIZATION_URL = GITHUB_ORGANIZATION_URL;
            this.GITTER_URL = GITTER_URL;
        }

        $onInit () {
            this.api = {
                me: {
                    accessRestriction: this.OvhApiMe.AccessRestriction().v6()
                }
            };
            this.isLoading = true;

            return this.api.me.accessRestriction
                .developerMode().$promise
                .then((developerModeRestriction) => {
                    this.developerModeRestriction = developerModeRestriction;
                    return developerModeRestriction;
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }

        updateDeveloperModeRestriction () {
            this.isUpdating = true;

            return this.api.me.accessRestriction
                .updateDeveloperMode(this.developerModeRestriction).$promise
                .then(() => {
                    const successKey = `user_account_advanced_section_developer_alert_success_${this.developerModeRestriction.enabled ? "enabled" : "disabled"}`;
                    return this.Alerter.success(this.$translate.instant(successKey), "useraccount.alerts.dashboardAdvanced");
                })
                .catch(() => this.Alerter.error(this.$translate.instant("user_account_advanced_section_developer_alert_error"), "useraccount.alerts.dashboardAdvanced"))
                .finally(() => {
                    this.isUpdating = false;
                });
        }
    });
