import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    hasDefaultMeansOfPayment: '<',
    usersWhoCanReceiveSMS: '<',
  },
  controller,
  template,
};
