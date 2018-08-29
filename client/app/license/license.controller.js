angular.module('Module.license').controller('LicenseCtrl', [
  '$scope',
  '$state',
  'License',
  '$timeout',
  'constants',
  'Billing.URLS',
  ($scope, $state, License, $timeout, constants, billingUrls) => {
    $scope.licencesTableLoading = false;
    $scope.licenses = null;
    $scope.licenseTypes = {
      CPANEL: 'CPANEL',
      DIRECTADMIN: 'DIRECTADMIN',
      PLESK: 'PLESK',
      SPLA: 'SPLA',
      SQLSERVER: 'SQLSERVER',
      VIRTUOZZO: 'VIRTUOZZO',
      WINDOWS: 'WINDOWS',
    };
    $scope.filterType = null;
    $scope.$state = $state;

    /**
     * Search
     * @param  {String} type
     * @return {Void}
     */
    $scope.search = (type) => {
      $scope.filterType = type;
      $scope.$broadcast('paginationServerSide.loadPage', 1, 'licensesPagination');
    };

    $scope.resetAction = () => $scope.setAction(false);

    $scope.$on('$locationChangeStart', () => $scope.resetAction());

    $scope.setAction = (action, data) => {
      if (action) {
        $scope.currentAction = action;
        $scope.currentActionData = data;
        $scope.stepPath = `license/${$scope.currentAction}.html`;
        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        $scope.currentActionData = null;
        $timeout(() => {
          $scope.stepPath = '';
        }, 300);
      }
    };

    $scope.loadDatagridLicences = ({ offset, pageSize }) => $scope
      .loadLicenses(pageSize, offset - 1)
      .then(licenses => ({
        data: _.get(licenses, 'list.results'),
        meta: {
          totalCount: licenses.count,
        },
      }));

    /**
     * Load licenses.
     * @param  {Number} count
     * @param  {Number} offset
     * @return {Promise}
     */
    $scope.loadLicenses = (count, offset) => {
      $scope.licencesTableLoading = true;
      return License.get('', {
        params: {
          filterType: $scope.filterType === 'ALL_TYPE' ? undefined : $scope.filterType,
          count,
          offset,
        },
      }).then((licenses) => {
        if (_.chain(licenses).get('availableTypes').isArray().value()) {
          licenses.availableTypes.push('ALL_TYPE');
        }
        angular.forEach(licenses.list.results, (value, idx) => {
          if (value.expiration !== null) {
            licenses.list.results[idx].isExpired = moment() // eslint-disable-line
              .isAfter(moment(value.expiration, 'YYYY-MM-DDTHH:mm:ss.SSSZZ'));
            licenses.list.results[idx].expireSoon = moment() // eslint-disable-line
              .add(1, 'months')
              .isAfter(moment(value.expiration, 'YYYY-MM-DDTHH:mm:ss.SSSZZ'));
          }
        });
        $scope.licenses = licenses;
        return licenses;
      }).finally(() => {
        $scope.licencesTableLoading = false;
      });
    };

    /**
     * Get license Id.
     * @param  {Object} license
     * @return {Number}
     */
    $scope.getLicenseId = (license) => {
      if (license.type === $scope.licenseTypes.SPLA) {
        return `SPLA-${license.id}@${license.serverServiceName}`;
      }
      return license.id;
    };

    /**
     * Get renew URL.
     * @return {String}
     */
    $scope.getRenewUrl = () => {
      if (!$scope.user) {
        return constants.renew.replace('{serviceName}', '');
      }
      const renewUrl = billingUrls.renew[$scope.user.ovhSubsidiary];
      if (!renewUrl) {
        return constants.renew.replace('{serviceName}', '');
      }
      return renewUrl.replace('{serviceName}', '');
    };

    $scope.resetAction();
  },
]);
