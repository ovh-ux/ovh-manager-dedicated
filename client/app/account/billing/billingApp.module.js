angular
    .module("Billing")
    .config([
        "$stateProvider",
        "$urlServiceProvider",
        "BILLING_BASE_URL",
        "Billing.constants",
        ($stateProvider, $urlServiceProvider, BILLING_BASE_URL, constants) => {

            $stateProvider.state("app.account.billing", {
                url: "/billing",
                controller: "BillingCtrl",
                templateUrl: `${BILLING_BASE_URL}/billing.html`,
                "abstract": true,
                translations: ["account/billing"],
                resolve: {
                    denyEnterprise: ($q, currentUser) => {
                        if (currentUser.isEnterprise) {
                            return $q.reject({
                                status: 403,
                                message: "Access forbidden for enterprise accounts",
                                code: "FORBIDDEN_BILLING_ACCESS"
                            });
                        }

                        return true;
                    }
                }
            });

            $stateProvider.state("app.account.billing.service", {
                url: "",
                "abstract": true
            });

            $stateProvider.state("app.account.billing.payment", {
                url: "",
                "abstract": true
            });

            /**
             * ROUTE: Orders
             */
            $stateProvider.state("app.account.billing.orders", {
                url: "/orders",
                templateUrl: `${BILLING_BASE_URL}orders/billing-orders.html`,
                controller: "Billing.controllers.Orders"
            });

            $stateProvider.state("app.account.billing.orders.retract", {
                url: "/orders/retract/:id",
                templateUrl: `${BILLING_BASE_URL}orders/retraction/billing-orders-retraction.html`,
                controller: "Billing.controllers.OrderRetractionCtrl",
                controllerAs: "ctrl"
            });

            $urlServiceProvider.rules.when("/billing/orders/:id/retract", "/billing/orders/retract/:id");

            /**
             * ROUTE: Refunds
             */
            $stateProvider.state("app.account.billing.payment.refunds", {
                url: "/refunds",
                templateUrl: `${BILLING_BASE_URL}refunds/billing-refunds.html`,
                controller: "Billing.controllers.Refunds"
            });

            /**
             * ROUTE: sla
             */
            $stateProvider.state("app.account.billing.sla", {
                url: "/sla",
                templateUrl: `${BILLING_BASE_URL}sla/billing-sla.html`,
                controller: "Billing.controllers.Sla"
            });

            /**
             * ROUTE: Ovh Account
             */
            if (constants.target === "EU" || constants.target === "CA") {
                $stateProvider.state("app.account.billing.payment.ovhaccount", {
                    url: "/ovhaccount",
                    templateUrl: `${BILLING_BASE_URL}ovhAccount/billing-ovhAccount.html`,
                    controller: "Billing.controllers.OvhAccount"
                });
            }

            /**
             * ROUTE: Billing Mean
             */
            $stateProvider.state("app.account.billing.payment.mean", {
                url: "/mean",
                templateUrl: `${BILLING_BASE_URL}mean/billing-mean.html`,
                controller: "Billing.controllers.Mean"
            });

            if (constants.target === "US") {
                $stateProvider.state("app.account.billing.payment.meanAdd", {
                    url: "/mean/add?from",
                    templateUrl: `${BILLING_BASE_URL}paymentMethod/add/index.html`,
                    controller: "PaymentMethodAddCtrl",
                    controllerAs: "$ctrl"
                });
            } else {
                $stateProvider.state("app.account.billing.payment.meanAdd", {
                    url: "/mean/add",
                    templateUrl: `${BILLING_BASE_URL}mean/add/billing-mean-add.html`,
                    controller: "Billing.controllers.Mean.Add"
                });
            }

            /**
             * ROUTE: Auto renew
             */
            $stateProvider.state("app.account.billing.service.autoRenew", {
                url: "/autoRenew",
                templateUrl: `${BILLING_BASE_URL}autoRenew/billing-autoRenew.html`,
                controller: "Billing.controllers.AutoRenew"
            });

            /**
             * ROUTE: Ovh Fidelity
             */
            if (constants.target === "EU") {
                $stateProvider.state("app.account.billing.payment.fidelity", {
                    url: "/fidelity",
                    templateUrl: `${BILLING_BASE_URL}fidelity/billing-fidelity.html`,
                    controller: "Billing.controllers.Fidelity"
                });
            }

            /**
             * ROUTE: Credits
             */
            $stateProvider.state("app.account.billing.payment.credits", {
                url: "/credits",
                templateUrl: `${BILLING_BASE_URL}credits/billing-credits.html`,
                controller: "Billing.controllers.Credits",
                controllerAs: "$ctrl"
            });

            $stateProvider.state("app.account.billing.payment.creditsMovements", {
                url: "/credits/:balanceName/movements",
                templateUrl: `${BILLING_BASE_URL}credits/movements/billing-credits-movements.html`,
                controller: "Billing.controllers.CreditsMovements",
                controllerAs: "$ctrl"
            });

            /**
             * ROUTE: Ovh vouchers
             */
            $stateProvider.state("app.account.billing.payment.vouchers", {
                url: "/vouchers",
                templateUrl: `${BILLING_BASE_URL}vouchers/billing-vouchers.html`,
                controller: "Billing.controllers.Vouchers"
            });

            /**
             * ROUTE: Ovh vouchers
             */
            $stateProvider.state("app.account.billing.payment.voucherMovements", {
                url: "/vouchers/:voucherAccountId/movements",
                templateUrl: `${BILLING_BASE_URL}vouchers/movements/billing-vouchers-movements.html`,
                controller: "Billing.controllers.Vouchers.Movements"
            });

            /**
             * ROUTE: Service termination
             */
            $stateProvider.state("app.account.billing.confirmTerminate", {
                url: "/confirmTerminate?id&token",
                templateUrl: `${BILLING_BASE_URL}confirmTerminate/billing-confirmTerminate.html`,
                controller: "Billing.controllers.TerminateServiceCtrl",
                controllerAs: "TerminateServiceCtrl"
            });
        }
    ])
    .run(($rootScope, constants) => {
        $rootScope.worldPart = constants.target;
    });
