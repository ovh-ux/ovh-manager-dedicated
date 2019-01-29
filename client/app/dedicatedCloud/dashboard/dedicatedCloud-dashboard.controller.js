export default class {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $stateParams,
    $timeout,
    $translate,
    $uibModal,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.options = this.servicePacks.find(sp => sp.isAssociatedToService).options;
    this.setAction = (action, data) => this.$scope.$parent.setAction(action, data);
  }

  openingModaleToEditDescription() {
    return this.$uibModal
      .open({
        animation: true,
        templateUrl: 'components/name-edition/name-edition.html',
        controller: 'NameEditionCtrl',
        controllerAs: '$ctrl',
        resolve: {
          data: () => ({
            contextTitle: 'dedicatedCloud_description',
            productId: this.$stateParams.productId,
            value: this.currentProduct.description,
          }),
        },
      }).result
      .then(() => this.$state.reload());
  }

  buildDescription() {
    return this.$translate.instant(
      'dedicatedCloud_type_template',
      {
        productName: this.$translate.instant(`dedicatedCloud_type_${this.currentProduct.solution}`),
        versionDisplayValue: this.currentProduct.solution === 'VSPHERE' && this.currentProduct.version ? ` ${this.currentProduct.version.major}` : '',
      },
    );
  }

  getUserAccessPolicyLabel() {
    const policy = this.currentProduct.userAccessPolicy;
    const formattedPolicy = _.snakeCase(policy).toUpperCase();

    return _.isString(formattedPolicy) && !_.isEmpty(formattedPolicy)
      ? this.$translate.instant(`dedicatedCloud_user_access_policy_${formattedPolicy}`)
      : '-';
  }
}
