import controller from './edit.controller';
import template from './edit.html';

export default {
  bindings: {
    changeContact: '<',
    goBack: '<',
    service: '<',
  },
  controller,
  template,
};
