angular.module("UserAccount.controllers").controller("UserAccount.controllers.agreements.details", [
    "$stateParams",
    "$q",
    "$log",
    "UserAccount.services.agreements",
    "Alerter",
    "translator",
    "User",
    function ($stateParams, $q, $log, Service, Alerter, translator, User) {
        "use strict";

        const CGV_AGREEMENT_ID = 1635;

        this.$ngInit = () => {
            this.accepted = false;
            this.loading = true;
            this.confirmed = false;
            this.alreadyAccepted = false;

            $q
                .all([Service.getAgreement($stateParams.id), Service.getContract($stateParams.id), User.getUser()])
                .then((result) => {
                    this.agreement = result[0];
                    this.contract = result[1];
                    this.isIndividual = result[2].legalform === "individual";
                    this.alreadyAccepted = this.agreement.agreed === "ok";
                    this.confirmed = this.alreadyAccepted;
                    this.accepted = this.alreadyAccepted;
                    this.isCGVContract = this.agreement.contractId === CGV_AGREEMENT_ID;
                })
                .catch((err) => {
                    Alerter.error(translator.tr("user_agreements_error"), "agreements_details_alerter");
                    return $q.reject(err);
                })
                .finally(() => {
                    this.loading = false;
                });
        };

        this.accept = () => {
            Service.accept($stateParams.id)
                .then(() => {
                    this.accepted = true;
                    Alerter.success(translator.tr("user_agreement_details_success"), "agreements_details_alerter");
                })
                .catch((err) => {
                    Alerter.error(translator.tr("user_agreement_details_error"), "agreements_details_alerter");
                    $q.reject(err);
                });
        };

        this.$ngInit();
    }
]);
