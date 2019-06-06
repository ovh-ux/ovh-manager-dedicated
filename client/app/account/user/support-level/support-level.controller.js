import _ from 'lodash';

export default class UserAccountSupportLevelCtrl {
  /* @ngInject */

  constructor(schema, supportLevel) {
    this.supportLevelsEnum = _.get(schema.models, 'me.SupportLevel.LevelTypeEnum').enum;
    this.supportLevel = supportLevel;

    this.supportLevels = this.supportLevelsEnum.map(level => ({
      name: level,
      url: '',
      isRecommended: level === 'premium',
      isActive: level !== 'premium-accredited',
    }));
  }

  $onInit() {
    this.loading = false;
  }
}
