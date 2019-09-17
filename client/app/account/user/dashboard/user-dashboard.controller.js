import {
  USER_DASHBOARD_SHORTCUTS,
} from './user-dashboard.constants';

export default class UserAccountDashoardCtrl {
  /* @ngInject */
  constructor($translate) {
    this.$translate = $translate;
    this.shortcuts = USER_DASHBOARD_SHORTCUTS;
  }
}
