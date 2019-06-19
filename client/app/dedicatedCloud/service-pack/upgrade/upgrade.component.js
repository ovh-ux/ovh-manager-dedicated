import controller from './upgrade.controller';
import template from './upgrade.html';

export default {
  bindings: {
    $transition$: '<',
    orderableServicePacks: '<',
    servicePacks: '<',
  },
  controller,
  name: 'ovhManagerPccServicePackUpgrade',
  template,
};
