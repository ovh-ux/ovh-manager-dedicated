import { AVAILABLE_SUPPORT_LEVEL, INACTIVE_SUPPORT_LEVEL } from './support-level.constants';

export default class SupportLevel {
  constructor(supportLevel) {
    Object.assign(this, supportLevel);
  }

  isAvailable() {
    return AVAILABLE_SUPPORT_LEVEL.includes(this.name);
  }

  isActive() {
    return !INACTIVE_SUPPORT_LEVEL.includes(this.name);
  }
}
