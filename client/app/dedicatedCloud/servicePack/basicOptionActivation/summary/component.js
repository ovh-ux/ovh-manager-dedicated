import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    orderedServicePackDisplayValue: '<',
    orderURL: '<',
    urlToGuides: '<',
  },
  controller,
  template,
};
