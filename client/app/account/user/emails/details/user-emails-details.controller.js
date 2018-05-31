angular
    .module("UserAccount")
    .controller("UserAccountEmailsDetailsController", class UserAccountEmailsDetailsController {
        constructor ($stateParams, $translate, Alerter, OvhApiMe) {
            this.$stateParams = $stateParams;
            this.$translate = $translate;
            this.Alerter = Alerter;
            this.OvhApiMe = OvhApiMe;
        }

        $onInit () {
            this.emailNotification = null;
            this.isLoading = false;

            return this.getEmail();
        }

        getEmail () {
            this.isLoading = true;
            return this.OvhApiMe.Notification().Email().History().v6()
                .get({ id: this.$stateParams.emailId }).$promise
                .then((emailNotification) => {
                    this.emailNotification = emailNotification;
                    this.emailNotification.bodyCook = this.constructor.parseBody(this.emailNotification.body);

                    // A toggle used to display raw or cooked body
                    this.emailNotification.displayBodyCook = !!this.emailNotification.bodyCook;
                    return this.emailNotification;
                })
                .catch((err) => this.Alerter.error(this.$translate.instant("otrs_email_detail_error", { t0: this.$stateParams.emailId }), err.data, "otrs_email_detail"))
                .finally(() => {
                    this.isLoading = false;
                });
        }

        static parseBody (body) {
            let parsedBody = body;

            if (!angular.isString(body)) {
                return null;
            }

            /* each other links inside the text */
            parsedBody = parsedBody.replace(/([^"']|^)(https?:\/\/([^\/\s]+\/)*([^\/\s]+)\/?)(?!"|')(\s|$)/gi, '$1<a href="$2" target="_blank">$2</a>$5');

            /* each email inside the text */
            /* eslint-disable max-len */
            parsedBody = parsedBody.replace(
                /(\[\d{1,2}\])?(\s)?([a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9]{2}(?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)(\s|$)/gi,
                '$2<a href="mailto:$3">$3</a>$4'
            );
            /* eslint-enable max-len */

            if (body === parsedBody) {
                return null;
            }

            return parsedBody;
        }
    });
