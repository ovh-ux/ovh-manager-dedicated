import controller from './error.controller';
import template from './error.html';

export default {
  bindings: {
    error: '<',
    homeLink: '<',
    reload: '<',
  },
  controller,
  template,
};
