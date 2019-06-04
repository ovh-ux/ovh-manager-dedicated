import { controller } from './upgrade.controller';

export default {
  layout: {
    name: 'modal',
  },
  translations: ['./translations'],
  url: '/upgradeResource?id&type',
  views: {
    modal: {
      templateUrl: 'dedicatedCloud/resource/upgrade/upgrade.html',
      controller,
    },
  },
};
