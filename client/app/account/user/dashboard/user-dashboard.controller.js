import _ from 'lodash';
import {
  USER_DASHBOARD_SHORTCUTS,
} from './user-dashboard.constants';

export default class UserAccountDashoardCtrl {
  /* @ngInject */
  constructor($translate, lastBill, supportLevel, user) {
    this.$translate = $translate;
    this.lastBill = _.first(lastBill.data);
    this.supportLevel = supportLevel;
    this.user = user;
    this.shortcuts = USER_DASHBOARD_SHORTCUTS;
  }
}
