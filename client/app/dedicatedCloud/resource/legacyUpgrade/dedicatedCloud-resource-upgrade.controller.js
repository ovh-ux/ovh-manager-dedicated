angular
  .module('App')
  .controller('DedicatedCloudHostToMonthlyCtrl', class {
    constructor(
      $q,
      $rootScope,
      $scope,
      $stateParams,
      $translate,
      $window,
      Alerter,
      DedicatedCloud,
      User,
    ) {
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$stateParams = $stateParams;
      this.$translate = $translate;
      this.$window = $window;
      this.Alerter = Alerter;
      this.DedicatedCloud = DedicatedCloud;
      this.User = User;
    }

    $onInit() {
      this.resourceId = _.get(this.$scope, 'currentActionData.id');
      this.resourceType = _.get(this.$scope, 'currentActionData.type');
      this.upgradeType = _.get(this.$scope, 'currentActionData.upgradeType');

      this.$scope.model = {
        capacity: null,
        duration: null,
      };

      this.$scope.loading = {
        durations: null,
      };

      this.$scope.agree = {
        value: false,
      };

      this.$scope.fetchDurations = () => this.fetchDurations();
      this.$scope.loadContracts = () => this.loadContracts();
      this.$scope.backToContracts = () => this.backToContracts();
      this.$scope.getResumePrice = price => this.getResumePrice(price);
      this.$scope.upgradedResource = () => this.upgradedResource();

      return this.User
        .getUser()
        .then((user) => {
          this.ovhSubsidiary = user.ovhSubsidiary;
        });
    }

    /*= =============================
    =            STEP 1            =
    ============================== */

    fetchDurations() {
      this.$scope.durations = {
        available: null,
        details: {},
      };

      this.$scope.loading.durations = true;

      return this.DedicatedCloud
        .getUpgradeResourceDurations(
          this.$stateParams.productId,
          this.upgradeType,
          this.resourceType,
          this.resourceId,
        )
        .then((durations) => {
          this.$scope.durations.available = durations;
          return this.fetchPrices(durations);
        })
        .finally(() => {
          this.$scope.loading.durations = false;
        });
    }

    fetchPrices(durations) {
      this.$scope.loading.prices = true;

      return this.$q
        .all(durations.map(duration => this.DedicatedCloud
          .getUpgradeResourceOrder(
            this.$stateParams.productId,
            this.upgradeType,
            duration,
            this.resourceType,
            this.resourceId,
          )
          .then((details) => {
            this.$scope.durations.details[duration] = details;
          })))
        .then(() => {
          if (durations && durations.length === 1) {
            this.$scope.model.duration = _.first(durations);
          }
        })
        .catch(({ data }) => {
          this.Alerter.alertFromSWS(this.$translate.instant('dedicatedCloud_order_loading_error'), data);
        })
        .finally(() => {
          this.$scope.loading.prices = false;
        });
    }

    /*= =============================
    =            STEP 2            =
    ============================== */

    loadContracts() {
      this.$scope.agree.value = false;
      if (!this.$scope.durations.details[this.$scope.model.duration].contracts
        || !this.$scope.durations.details[this.$scope.model.duration].contracts.length) {
        this.$rootScope.$broadcast('wizard-goToStep', 5);
      }
    }

    backToContracts() {
      if (!this.$scope.durations.details[this.$scope.model.duration].contracts
        || !this.$scope.durations.details[this.$scope.model.duration].contracts.length) {
        this.$rootScope.$broadcast('wizard-goToStep', 2);
      }
    }

    /*= =============================
    =            STEP 3            =
    ============================== */

    getResumePrice(price) {
      return price.value === 0
        ? this.$translate.instant('price_free')
        : this.$translate.instant('price_ht_label', { price: price.text });
    }

    upgradedResource() {
      this.$scope.loading.validation = true;
      let orderUrl = '';

      // You cannot call window.open in an async call in safari (like the follow promise)
      // so hold a ref to a new window and set the url once it get it.
      const windowRef = this.$window.open();

      return this.DedicatedCloud
        .upgradedResource(
          this.$stateParams.productId,
          this.upgradeType,
          this.$scope.model.duration,
          this.resourceType,
          this.resourceId,
        )
        .then((order) => {
          const message = this.$translate.instant('dedicatedCloud_order_finish_success', {
            t0: order.url,
            t1: order.orderId,
          });
          this.$scope.setMessage(message, true);
          this.Alerter.alertFromSWS(message, { idTask: order.orderId, state: 'OK' });
          orderUrl = order.url;
          this.$scope.resetAction();
        })
        .catch((data) => {
          const message = this.$translate.instant('dedicatedCloud_order_finish_error');
          this.$scope.setMessage(message, angular.extend(data, { type: 'ERROR' }));
          this.Alerter.alertFromSWS(message, data.data);
        })
        .finally(() => {
          this.$scope.loading.validation = false;
          if (_.isEmpty(orderUrl)) {
            windowRef.close();
          } else {
            windowRef.location = orderUrl;
          }
        });
    }
  });
