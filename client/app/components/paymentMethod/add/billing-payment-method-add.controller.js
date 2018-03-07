angular.module("directives").controller(
    "BillingPaymentMethodAddCtrl",
    class BillingPaymentMethodAddCtrl {
        onSelectionChanged (newPaymentMethod) {
            const formattedNewPaymentMethod = newPaymentMethod ? _.merge({ type: this.type }, newPaymentMethod) : null;

            this.onChange({ newPaymentMethod: formattedNewPaymentMethod });
        }
    }
);
