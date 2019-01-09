angular.module('App').config((ovhPaymentMethodProvider, constants) => {
  ovhPaymentMethodProvider.setTarget(constants.target);
});
