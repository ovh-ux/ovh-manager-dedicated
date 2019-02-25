import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    $transition$: '<',
    orderableServicePacks: '<',
    servicePacks: '<',
  },
  controller,
  template,
};
