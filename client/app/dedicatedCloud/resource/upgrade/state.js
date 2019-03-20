import { controllerName } from './controller';

export default {
  layout: {
    name: 'modal',
  },
  translations: ['./translations'],
  url: '/upgradeResource?id&type',
  views: {
    modal: {
      templateUrl: 'dedicatedCloud/resource/upgrade/template.html',
      controller: controllerName,
    },
  },
};
