import { AUTORENEW_RECENT_SUBSIDIARIES } from './user.constants';

export default class {
  constructor(user) {
    Object.assign(this, user);
  }

  hasRecentAutorenew() {
    return AUTORENEW_RECENT_SUBSIDIARIES.includes(this.ovhSubsidiary);
  }
}
