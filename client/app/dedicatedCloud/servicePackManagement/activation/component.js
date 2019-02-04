import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    allOptions: '<',
    catalog: '<',
    currentService: '<',
    availableServicePacks: '<',
  },
  controller,
  template,
};
