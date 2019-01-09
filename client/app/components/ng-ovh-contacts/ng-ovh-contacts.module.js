angular.module('App').config((ovhContactsProvider, constants) => {
  ovhContactsProvider.setTarget(constants.target);
});
