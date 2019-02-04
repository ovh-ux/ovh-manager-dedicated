import { ALL_EXISTING_OPTIONS, OPTION_TYPES } from '../servicePackManagement/dedicatedCloud-option.constants';

/* @ngInject */
export default class {
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
    const currentServicePack = this.availableServicePacks[this.currentService.servicePackName];

    this.optionsTheServiceAlreadyHas = currentServicePack.options
      .map(optionName => ALL_EXISTING_OPTIONS[optionName]);

    this.currentSPIsACertification = ALL_EXISTING_OPTIONS[
      currentServicePack.name
    ].type === OPTION_TYPES.certification
      ? currentServicePack.name
      : null;

    this.availableOptionsToActivate = Array
      .from(
        new Set(
          _.flatten(
            Object.values(this.availableServicePacks)
              .filter(servicePack => servicePack.name !== currentServicePack.name)
              .map(servicePack => servicePack.options),
          ),
        ),
      )
      .filter(optionName => ALL_EXISTING_OPTIONS[optionName].type === OPTION_TYPES.option)
      .filter(optionName => !currentServicePack.options.includes(optionName));

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
            value: this.currentService.description,
          }),
        },
      }).result
      .then(() => this.$state.reload());
  }

  buildDescription() {
    return this.$translate.instant(
      'dedicatedCloud_type_template',
      {
        productName: this.$translate.instant(`dedicatedCloud_type_${this.currentService.solution}`),
        versionDisplayValue: this.currentService.solution === 'VSPHERE' && this.currentService.version ? ` ${this.currentService.version.major}` : '',
      },
    );
  }

  getUserAccessPolicyLabel() {
    const policy = this.currentService.userAccessPolicy;
    const formattedPolicy = _.snakeCase(policy).toUpperCase();

    return _.isString(formattedPolicy) && !_.isEmpty(formattedPolicy)
      ? this.$translate.instant(`dedicatedCloud_user_access_policy_${formattedPolicy}`)
      : '-';
  }
}
