angular.module("UserAccount.controllers").controller("UserAccount.controllers.advanced", [
    "UserAccount.services.Infos",
    "Alerter",
    "translator",
    function (userAccountServiceInfos, Alerter, translator) {
        "use strict";

        this.isLoadingDeveloperMode = false;

        this.$ngInit = () => {
            this.isLoadingDeveloperMode = true;
            userAccountServiceInfos
                .getDeveloperMode()
                .then((developmentMode) => {
                    this.developmentMode = developmentMode;
                })
                .finally(() => {
                    this.isLoadingDeveloperMode = false;
                });
        };

        this.updateDevelopmentMode = () => {
            this.isLoadingDeveloperMode = true;
            const successKey = this.developmentMode.enabled ? "user_account_advanced_section_developer_alert_success_enabled" : "user_account_advanced_section_developer_alert_success_disabled";
            userAccountServiceInfos
                .updateDeveloperMode(this.developmentMode)
                .then(() => Alerter.success(translator.tr(successKey), "useraccount.alerts.dashboardAdvanced"), () => Alerter.error(translator.tr("user_account_advanced_section_developer_alert_error"), "useraccount.alerts.dashboardAdvanced"))
                .finally(() => {
                    this.isLoadingDeveloperMode = false;
                });
        };

        this.$ngInit();
    }
]);
