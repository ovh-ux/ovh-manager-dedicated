import controller from './selection.controller';
import template from './selection.html';

export default {
  bindings: {
    activationType: '<',
    currentUser: '<',
    currentService: '<',
    header: '@',
    hasDefaultMeansOfPayment: '<',
    orderableServicePacks: '<',
    servicePacksWithPrices: '<',
    subheader: '@',
  },
  controller,
  name: 'ovhManagerPccServicePackUpgradeSelection',
  require: {
    stepper: '^ovhManagerComponentStepper',
  },
  template,
};
