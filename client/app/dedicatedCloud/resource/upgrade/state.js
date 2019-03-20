import { controller } from './controller';

export default {
  layout: {
    name: 'modal', t,
  },
  translations: ['./translations'],
  url: '/upgradeResource?id&type',
  views: {
    modal: {
      templateUrl: 'dedicatedCloud/resource/upgrade/template.html',
      controller,
    },
  },
};
