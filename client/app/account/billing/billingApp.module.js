angular
    .module("Billing")
    .config([
        "$stateProvider",
        "BILLING_BASE_URL",
        "Billing.constants",
        ($stateProvider, BILLING_BASE_URL, constants) => {

            const denyBillingSectionForEnterpriseResolve = ($q, User) =>
                User.getUser().then((curUser) => {
                    if (curUser.isEnterprise) {
                        return $q.reject({
                            status: 403,
                            message: "Access forbidden for enterprise accounts",
                            code: "FORBIDDEN_BILLING_ACCESS"
                        });
                    }

                    return true;
                });

            $stateProvider.state("app.account.billing", {
                url: "/billing",
                controller: "Billing.controllers.main",
                templateUrl: `${BILLING_BASE_URL}/billing.html`,
                "abstract": true,
                resolve: {
                    denyEnterprise: denyBillingSectionForEnterpriseResolve
                }
            });

            $stateProvider.state("app.account.service.billing", {
                url: "/billing",
                controller: "Billing.controllers.main",
                templateUrl: `${BILLING_BASE_URL}/billing.html`,
                "abstract": true,
                resolve: {
                    denyEnterprise: denyBillingSectionForEnterpriseResolve
                }
            });

            $stateProvider.state("app.account.payment", {
                url: "/billing",
                controller: "Billing.controllers.main",
                templateUrl: `${BILLING_BASE_URL}/billing.html`,
                "abstract": true,
                resolve: {
                    denyEnterprise: denyBillingSectionForEnterpriseResolve
                }
            });

            $stateProvider.state("app.account.consumption", {
                url: "/billing",
                controller: "Billing.controllers.main",
                templateUrl: `${BILLING_BASE_URL}/billing.html`,
                "abstract": true,
                resolve: {
                    denyEnterprise: denyBillingSectionForEnterpriseResolve
                }
            });

            /**
             * ROUTE: History
             */

            $stateProvider.state("app.account.billing.history", {
                url: "/history",
                templateUrl: `${BILLING_BASE_URL}history/billing-history.html`,
                controller: "Billing.controllers.History",
                controllerAs: "ctrl"
            });

            $stateProvider.state("app.account.debtDetails", {
                url: "/history/:debtId/details",
                templateUrl: `${BILLING_BASE_URL}history/details/billing-history-details.html`,
                controller: "Billing.controllers.HistoryDetailsCtrl"
            });

            /**
             * ROUTE: Payments
             */
            $stateProvider.state("app.account.billing.payments", {
                url: "/payments",
                templateUrl: `${BILLING_BASE_URL}payments/index.html`,
                controller: "Billing.controllers.PaymentsCtrl",
                controllerAs: "ctrl"
            });

            $stateProvider.state("app.account.billing.paymentsDetails", {
                url: "/payments/:id/details",
                templateUrl: `${BILLING_BASE_URL}payments/details/billing-payments-details.html`,
                controller: "Billing.controllers.PaymentDetailsCtrl",
                controllerAs: "ctrl"
            });

            /**
             * ROUTE: Orders
             */
            $stateProvider.state("app.account.orders", {
                url: "/billing/orders",
                templateUrl: `${BILLING_BASE_URL}orders/billing-orders.html`,
                controller: "Billing.controllers.Orders"
            });

            $stateProvider.state("app.account.ordersRetract", {
                url: "/billing/orders/:id/retract",
                templateUrl: `${BILLING_BASE_URL}orders/retraction/billing-orders-retraction.html`,
                controller: "Billing.controllers.OrderRetractionCtrl",
                controllerAs: "ctrl"
            });

            /**
             * ROUTE: Refunds
             */
            $stateProvider.state("app.account.payment.refunds", {
                url: "/refunds",
                templateUrl: `${BILLING_BASE_URL}refunds/billing-refunds.html`,
                controller: "Billing.controllers.Refunds"
            });

            /**
             * ROUTE: sla
             */
            $stateProvider.state("app.account.billing.sla", {
                url: "/sla",
                templateUrl: `${BILLING_BASE_URL}billing/sla/billing-sla.html`,
                controller: "Billing.controllers.Sla"
            });

            /**
             * ROUTE: Ovh Account
             */
            if (constants.target === "EU" || constants.target === "CA") {
                $stateProvider.state("app.account.payment.ovhaccount", {
                    url: "/ovhaccount",
                    templateUrl: `${BILLING_BASE_URL}ovhAccount/billing-ovhAccount.html`,
                    controller: "Billing.controllers.OvhAccount"
                });
            }

            /**
             * ROUTE: Billing Mean
             */
            $stateProvider.state("app.account.payment.mean", {
                url: "/mean",
                templateUrl: `${BILLING_BASE_URL}mean/billing-mean.html`,
                controller: "Billing.controllers.Mean"
            });

            if (constants.target === "US") {
                $stateProvider.state("app.account.payment.meanAdd", {
                    url: "/mean/add",
                    templateUrl: `${BILLING_BASE_URL}paymentMethod/add/index.html`
                });
            } else {
                $stateProvider.state("app.account.payment.meanAdd", {
                    url: "/mean/add",
                    templateUrl: `${BILLING_BASE_URL}mean/add/billing-mean-add.html`,
                    controller: "Billing.controllers.Mean.Add"
                });
            }

            /**
             * ROUTE: Tel. Consumptions
             */
            $stateProvider.state("app.account.consumption.consumptionsTelephony", {
                url: "/billing/consumptionsTelephony",
                templateUrl: `${BILLING_BASE_URL}consumptionsTelephony/consumptionsTelephony.html`,
                controller: "Billing.controllers.ConsumptionsTelephony"
            });

            /**
             * ROUTE: Last tel. Consumptions
             */
            $stateProvider.state("app.account.consumption.lastConsumptionsTelephony", {
                url: "/billing/lastConsumptionsTelephony",
                templateUrl: `${BILLING_BASE_URL}lastConsumptionsTelephony/billing-lastConsumptionsTelephony.html`,
                controller: "Billing.controllers.LastConsumptionsTelephony"
            });

            /**
             * ROUTE: Auto renew
             */
            $stateProvider.state("app.account.service.billing.autoRenew", {
                url: "/autoRenew",
                templateUrl: `${BILLING_BASE_URL}autoRenew/billing-autoRenew.html`,
                controller: "Billing.controllers.AutoRenew"
            });

            /**
             * ROUTE: Ovh Fidelity
             */
            if (constants.target === "EU") {
                $stateProvider.state("app.account.payment.fidelity", {
                    url: "/fidelity",
                    templateUrl: `${BILLING_BASE_URL}fidelity/billing-fidelity.html`,
                    controller: "Billing.controllers.Fidelity"
                });
            }

            /**
             * ROUTE: Credits
             */
            $stateProvider.state("app.account.payment.credits", {
                url: "/credits",
                templateUrl: `${BILLING_BASE_URL}credits/billing-credits.html`,
                controller: "Billing.controllers.Credits",
                controllerAs: "$ctrl"
            });

            $stateProvider.state("app.account.payment.creditsMovements", {
                url: "/credits/:balanceName/movements",
                templateUrl: `${BILLING_BASE_URL}credits/movements/billing-credits-movements.html`,
                controller: "Billing.controllers.CreditsMovements",
                controllerAs: "$ctrl"
            });

            /**
             * ROUTE: Ovh vouchers
             */
            $stateProvider.state("app.account.payment.vouchers", {
                url: "/vouchers",
                templateUrl: `${BILLING_BASE_URL}vouchers/billing-vouchers.html`,
                controller: "Billing.controllers.Vouchers"
            });

            /**
             * ROUTE: Ovh vouchers
             */
            $stateProvider.state("app.account.payment.voucherMovements", {
                url: "/vouchers/:voucherAccountId/movements",
                templateUrl: `${BILLING_BASE_URL}vouchers/movements/billing-vouchers-movements.html`,
                controller: "Billing.controllers.Vouchers.Movements"
            });

            /**
             * ROUTE: Service termination
             */
            $stateProvider.state("app.account.billing.confirmTerminate", {
                url: "/confirmTerminate",
                templateUrl: `${BILLING_BASE_URL}confirmTerminate/billing-confirmTerminate.html`,
                controller: "Billing.controllers.TerminateServiceCtrl",
                controllerAs: "TerminateServiceCtrl"
            });
        }
    ])
    .run((translator, $rootScope, constants) => {
        translator.load(["billing"]);
        $rootScope.worldPart = constants.target;
    });
