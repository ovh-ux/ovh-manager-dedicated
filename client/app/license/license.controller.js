import _ from 'lodash';

angular
  .module('Module.license')
  .controller('LicenseCtrl', class {
    constructor(
      $scope,
      $state,
      $timeout,
      constants,
      License,
      BILLING_URLS,
    ) {
      this.$scope = $scope;
      this.$state = $state;
      this.$timeout = $timeout;
      this.constants = constants;
      this.License = License;
      this.BILLING_URLS = BILLING_URLS;
    }

    $onInit() {
      this.$scope.licencesTableLoading = false;
      this.$scope.licenses = null;
      this.$scope.licenseTypes = {
        CPANEL: 'CPANEL',
        DIRECTADMIN: 'DIRECTADMIN',
        PLESK: 'PLESK',
        SPLA: 'SPLA',
        SQLSERVER: 'SQLSERVER',
        VIRTUOZZO: 'VIRTUOZZO',
        WINDOWS: 'WINDOWS',
      };
      this.$scope.filterType = null;
      this.$scope.$state = this.$state;

      this.$scope.$on('$locationChangeStart', () => this.$scope.resetAction());

      this.resetAction();

      this.$scope.resetAction = () => this.resetAction();
      this.$scope.search = type => this.search(type);
      this.$scope.setAction = (action, data) => this.setAction(action, data);
      this.$scope.loadDatagridLicences = ({ offset, pageSize }) => this
        .loadDatagridLicences({ offset, pageSize });
      this.$scope.loadLicenses = ({ offset, pageSize }) => this.loadLicenses({ offset, pageSize });
      this.$scope.getLicenseId = license => this.getLicenseId(license);
    }

    resetAction() {
      return this.setAction(false);
    }

    /**
     * Search
     * @param  {String} type
     * @return {Void}
     */
    search(type) {
      this.$scope.filterType = type;
      this.$scope.$broadcast('paginationServerSide.loadPage', 1, 'licensesPagination');
    }

    setAction(action, data) {
      if (action) {
        this.$scope.currentAction = action;
        this.$scope.currentActionData = data;
        this.$scope.stepPath = `license/${this.$scope.currentAction}.html`;
        $('#currentAction').modal({
          keyboard: true,
          backdrop: 'static',
        });
      } else {
        $('#currentAction').modal('hide');
        this.$scope.currentActionData = null;
        this.$timeout(() => {
          this.$scope.stepPath = '';
        }, 300);
      }
    }

    loadDatagridLicences({ offset, pageSize }) {
      return this
        .loadLicenses(pageSize, offset - 1)
        .then(licenses => ({
          data: _.get(licenses, 'list.results'),
          meta: {
            totalCount: licenses.count,
          },
        }));
    }

    /**
     * Load licenses.
     * @param  {Number} count
     * @param  {Number} offset
     * @return {Promise}
     */
    loadLicenses(count, offset) {
      this.$scope.licencesTableLoading = true;

      return this.License
        .get('', {
          params: {
            filterType: this.$scope.filterType === 'ALL_TYPE' ? undefined : this.$scope.filterType,
            count,
            offset,
          },
        })
        .then((licenses) => {
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
          this.$scope.licenses = licenses;

          return licenses;
        }).finally(() => {
          this.$scope.licencesTableLoading = false;
        });
    }

    /**
     * Get license Id.
     * @param  {Object} license
     * @return {Number}
     */
    getLicenseId(license) {
      if (license.type === this.$scope.licenseTypes.SPLA) {
        return `SPLA-${license.id}@${license.serverServiceName}`;
      }

      return license.id;
    }

    /**
     * Get renew URL.
     * @return {String}
     */
    getRenewUrl() {
      if (!this.$scope.user) {
        return this.constants.renew.replace('{serviceName}', '');
      }

      const renewUrl = this.BILLING_URLS.renew[this.$scope.user.ovhSubsidiary];

      if (!renewUrl) {
        return this.constants.renew.replace('{serviceName}', '');
      }

      return renewUrl.replace('{serviceName}', '');
    }
  });
