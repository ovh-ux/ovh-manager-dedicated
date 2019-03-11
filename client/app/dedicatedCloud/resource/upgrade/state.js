import { CONTROLLER_NAME } from './constant';

export default {
  layout: {
    name: 'modal',
  },
  translations: ['./translations'],
  url: '/upgradeResource?id&type',
  views: {
    modal: {
      templateUrl: 'dedicatedCloud/resource/upgrade/template.html',
      controller: CONTROLLER_NAME,
    },
  },
};
