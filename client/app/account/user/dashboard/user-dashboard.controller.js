import _ from 'lodash';
import {
  USER_DASHBOARD_SHORTCUTS,
} from './user-dashboard.constants';

export default class UserAccountDashoardCtrl {
  /* @ngInject */

  constructor($translate, lastBill, supportLevel, user) {
    this.lastBill = _.first(lastBill);
    this.supportLevel = supportLevel;
    this.user = user;
    this.$translate = $translate;
    this.shortcuts = USER_DASHBOARD_SHORTCUTS;
  }
}
