import _ from 'lodash';

/* @ngInject */
export default class {
  constructor(
    $scope,
    $state,
    $stateParams,
    $timeout,
    $translate,
    $uibModal,
    DEDICATED_CLOUD_ACTIVATION_STATUS,
    DEDICATED_CLOUD_SERVICE_PACK_ACTIVATION,
    DEDICATED_CLOUD_SERVICE_PACK_OPTION,
  ) {
    this.$scope = $scope;
    this.$state = $state;
    this.$stateParams = $stateParams;
    this.$timeout = $timeout;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
    this.DEDICATED_CLOUD_ACTIVATION_STATUS = DEDICATED_CLOUD_ACTIVATION_STATUS;
    this.DEDICATED_CLOUD_SERVICE_PACK_ACTIVATION = DEDICATED_CLOUD_SERVICE_PACK_ACTIVATION;
    this.DEDICATED_CLOUD_SERVICE_PACK_OPTION = DEDICATED_CLOUD_SERVICE_PACK_OPTION;
  }

  $onInit() {
    const currentServicePack = _.find(
      this.servicePacks,
      { name: this.currentService.servicePackName },
    );

    this.optionsTheCurrentServicePackHas = _.filter(
      this.DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTIONS,
      { type: this.DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.basicOption },
    );

    this.allExistingOptions = _.sortBy(
      this.servicePacks
        .reduce((previousValue, currentValue) => [...previousValue, ...currentValue.options], [])
        .reduce((previousValue, currentValue) => (_.some(previousValue, { name: currentValue.name })
          ? previousValue
          : [...previousValue, currentValue]), [])
        .filter(option => option.type === this
          .DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.basicOption)
        .map(option => ({
          ...option,
          status: _.map(currentServicePack.options, 'name').includes(option.name)
            ? this.DEDICATED_CLOUD_ACTIVATION_STATUS.enabled
            : this.DEDICATED_CLOUD_ACTIVATION_STATUS.disabled,
        })),
      'name',
    );

    this.currentCertification = _.find(
      currentServicePack.options,
      { type: this.DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.certification },
    );

    this.orderableServicePacksWithOnlyBasicOptions = _.filter(
      _.reject(this.servicePacks, { name: currentServicePack.name }),
      servicePack => _.every(
        servicePack.options,
        option => _.isEqual(option.type, this
          .DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.basicOption),
      ),
    );

    this.orderableServicePacksWithCertifications = _.filter(
      _.reject(this.servicePacks, { name: currentServicePack.name }),
      servicePack => _.some(
        servicePack.options,
        option => _.isEqual(option.type, this
          .DEDICATED_CLOUD_SERVICE_PACK_OPTION.OPTION_TYPES.certification),
      ),
    );

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
