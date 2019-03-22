import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $scope,
    $state,
    $stateParams,
    $timeout,
    $translate,
    $uibModal,
    Alerter,
    constants,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.Alerter = Alerter;
    this.constants = constants;
  }

  $onInit() {
    this.allowDedicatedServerComplianceOptions = this.constants.target !== 'US';

    this.setAction = (action, data) => this.$scope.$parent.setAction(action, data);
  }

  openModalToEditDescription() {
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
            value: this.currentService.description,
          }),
        },
      }).result
      .then(() => {
        this.Alerter.alertFromSWS(this.$translate.instant('dedicatedCloud_datacenter_name_edit_success'), 'OK', 'dedicatedCloud');
      });
  }

  buildDescription() {
    const productName = this.$translate.instant(`dedicatedCloud_type_${this.currentService.solution}`);
    const versionDisplayValue = this.currentService.solution === 'VSPHERE' && this.currentService.version
      ? ` ${this.currentService.version.major}`
      : '';

    return `${productName}${versionDisplayValue}`;
  }

  getUserAccessPolicyLabel() {
    const policy = this.currentService.userAccessPolicy;
    const formattedPolicy = _.snakeCase(policy).toUpperCase();

    return _.isString(formattedPolicy) && !_.isEmpty(formattedPolicy)
      ? this.$translate.instant(`dedicatedCloud_user_access_policy_${formattedPolicy}`)
      : '-';
  }
}
