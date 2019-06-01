export default class UserAccountSupportLevelCtrl {
  /* @ngInject */

  constructor() {
    this.supportLevels = [
      {
        name: 'standard',
        url: '',
      },
      {
        name: 'premium',
        url: '',
      },
      {
        name: 'business',
        url: '',
      },
      {
        name: 'enterprise',
        url: '',
      },
    ];
  }

  $onInit() {
    this.loading = false;
  }
}
