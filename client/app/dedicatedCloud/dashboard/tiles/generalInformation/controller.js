import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $stateParams,
    $translate,
    $uibModal,
  ) {
    this.$stateParams = $stateParams;
    this.$translate = $translate;
    this.$uibModal = $uibModal;
  }

  $onInit() {
    this.bindings = {
      accessPolicy: this.buildAccessPolicy(),
      commercialRange: this.currentService.commercialRange,
      description: this.currentService.description,
      numberOfIPBlocks: {
        arin: this.currentService.ipArinCount,
        ripe: this.currentService.ipRipeCount,
      },
      location: this.currentService.location,
      numberOfDatacenters: this.currentService.datacenterCount,
      serviceName: this.currentService.name,
      softwareSolution: this.buildSoftwareSolution(),
      urls: {
        vScope: this.currentService.vScopeUrl,
        webInterface: this.currentService.webInterfaceUrl,
      },
    };
  }

  openModalToEditDescription() {
    return this.$uibModal
      .open({
        animation: true,
        controller: 'NameEditionCtrl',
        controllerAs: '$ctrl',
        resolve: {
          data: () => ({
            contextTitle: 'dedicatedCloud_description',
            productId: this.$stateParams.productId,
            value: this.currentService.description,
          }),
        },
        templateUrl: 'components/name-edition/name-edition.html',
      }).result
      .then((description) => {
        this.bindings.description = description;
      });
  }

  buildAccessPolicy() {
    const policy = this.currentService.userAccessPolicy;
    const policyIsConfigured = _.isString(policy) && !_.isEmpty(policy);

    return this.$translate.instant(
      policyIsConfigured
        ? `dedicatedCloudDashboardGeneralInformationTile_accessPolicy_definition_${policy.toUpperCase()}`
        : 'dedicatedCloudDashboardGeneralInformationTile_accessPolicy_definition_NOT_CONFIGURED',
    );
  }

  buildSoftwareSolution() {
    const solution = {
      displayName: this.$translate.instant(`dedicatedCloudDashboardGeneralInformationTile_softwareSolution_definition_displayName_${this.currentService.solution.toUpperCase()}`),
      displayVersionNumber: _.get(this.currentService.version, 'major', ''),
    };

    return `${solution.displayName} ${solution.displayVersionNumber}`.trim();
  }
}
