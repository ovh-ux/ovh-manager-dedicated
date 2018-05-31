angular
    .module("UserAccount")
    .controller("UserAccountEmailsController", class UserAccountEmailsController {
        constructor ($state, $translate, Alerter, OvhApiMe) {
            this.$state = $state;
            this.$translate = $translate;
            this.Alerter = Alerter;
            this.OvhApiMe = OvhApiMe;
        }

        loadDatagridUserEmails ({ offset, pageSize }) {
            return this.OvhApiMe.Notification().Email().History().v6()
                .query().$promise
                .then((ids) => {
                    const part = ids.reverse().slice(offset - 1, offset - 1 + pageSize);
                    return {
                        data: part.map((id) => ({ id })),
                        meta: {
                            totalCount: ids.length
                        }
                    };
                })
                .catch((err) => this.Alerter.alertFromSWS(this.$translate.instant("user_account_table_email_error"), err, "user_account_email"));
        }

        transformItem ({ id }) {
            return this.OvhApiMe.Notification().Email().History().v6()
                .get({ id }).$promise;
        }

        showEmailDetails (emailId) {
            return this.$state.go("app.account.useraccount.emailsDetails", {
                emailId
            });
        }
    });
