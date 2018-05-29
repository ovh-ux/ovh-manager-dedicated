angular
    .module("UserAccount")
    .controller("UserAccountAgreementsDetailsController", class UserAccountAgreementsDetailsController {
        constructor ($q, $stateParams, $translate, Alerter, CGV_AGREEMENT_ID, OvhApiMe) {
            this.$q = $q;
            this.$stateParams = $stateParams;
            this.$translate = $translate;
            this.Alerter = Alerter;
            this.CGV_AGREEMENT_ID = CGV_AGREEMENT_ID;
            this.OvhApiMe = OvhApiMe;
        }

        $onInit () {
            this.accepted = false;
            this.loading = true;
            this.confirmed = false;
            this.alreadyAccepted = false;
            this.api = {
                me: {
                    agreements: this.OvhApiMe.Agreements().v6()
                }
            };

            return this.$q
                .all({
                    contractAgreement: this.fetchContractAgreement(this.$stateParams.id),
                    contract: this.fetchContract(this.$stateParams.id),
                    user: this.fetchUser()
                })
                .then(({ contractAgreement, contract, user }) => {
                    this.agreement = contractAgreement;
                    this.contract = contract;
                    this.isIndividual = user.legalform === "individual";
                    this.alreadyAccepted = _.get(this.agreement, "agreed") === "ok";
                    this.confirmed = this.alreadyAccepted;
                    this.accepted = this.alreadyAccepted;
                    this.isCGVContract = _.get(this.agreement, "contractId") === this.CGV_AGREEMENT_ID;
                })
                .catch(() => this.Alerter.error(this.$translate.instant("user_agreements_error"), "agreements_details_alerter"))
                .finally(() => {
                    this.loading = false;
                });
        }

        fetchContractAgreement (id) {
            return this.api.me.agreements
                .get({ id }).$promise;
        }

        fetchContract (id) {
            return this.api.me.agreements
                .contract({ id }).$promise;
        }

        fetchUser () {
            return this.OvhApiMe.v6().get().$promise;
        }

        accept () {
            return this.api.me.agreements
                .accept({ id: this.$stateParams.id }, {}).$promise
                .then(() => {
                    this.accepted = true;
                    return this.Alerter.success(this.$translate.instant("user_agreement_details_success"), "agreements_details_alerter");
                })
                .catch(() => this.Alerter.error(this.$translate.instant("user_agreement_details_error"), "agreements_details_alerter"));
        }
    });
