import template from './dashboard.html';

export default {
  bindings: {
    currentDrp: '<',
    currentService: '<',
    currentUser: '<',
  },
  name: 'ovhManagerPccDashboard',
  template,
};
