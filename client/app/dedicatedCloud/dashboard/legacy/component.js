import controller from './controller';
import template from './template.html';

export const component = {
  bindings: {
    currentService: '<',
    currentUser: '<',
  },
  controller,
  template,
};

export const componentName = 'legacyDashboard';

export default {
  component,
  componentName,
};
