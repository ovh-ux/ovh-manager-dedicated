import _ from 'lodash';
import { URLS } from './support-level.constants';

export default class UserAccountSupportLevelCtrl {
  /* @ngInject */

  constructor(me, schema, supportLevel) {
    this.supportLevelsEnum = _.get(schema.models, 'me.SupportLevel.LevelTypeEnum').enum;
    this.supportLevel = supportLevel;
    this.me = me;
    this.supportLevels = this.supportLevelsEnum.map(level => ({
      name: level,
      url: _.get(URLS, `${this.me.ovhSubsidiary.toUpperCase()}.${level}`, `FR.${level}`),
      isRecommended: level === 'premium',
      isActive: level !== 'premium-accredited',
    }));
  }

  $onInit() {
    this.loading = false;
  }
}
