angular
  .module('Module.ip.controllers')
  .controller('IpOrderCtrl', class {
    constructor(
      $q,
      $rootScope,
      $scope,
      $translate,
      $window,
      Alerter,
      constants,
      DedicatedCloud,
      Ip,
      IpAgoraOrder,
      IpOrder,
      IpOrganisation,
      User,
    ) {
      this.$q = $q;
      this.$rootScope = $rootScope;
      this.$scope = $scope;
      this.$translate = $translate;
      this.$window = $window;
      this.Alerter = Alerter;
      this.constants = constants;
      this.DedicatedCloud = DedicatedCloud;
      this.Ip = Ip;
      this.IpAgoraOrder = IpAgoraOrder;
      this.IpOrder = IpOrder;
      this.IpOrganisation = IpOrganisation;
      this.User = User;
    }

    $onInit() {
      this.alertId = 'ip_order_alert';

      this.$scope.model = {};
      this.$scope.user = {};
      this.$scope.agree = {
        value: false,
      };

      this.$scope.loading = {};

      this.$scope.getServices = () => this.getServices();
      this.$scope.canServiceBeOrdered = () => this.canServiceBeOrdered();
      this.$scope.loadOrderForm = () => this.loadOrderForm();
      this.$scope.isMonthlyVps = () => this.isMonthlyVps();
      this.$scope.orderFormValid = () => this.orderFormValid();
      this.$scope.checkDedicatedBlockSize = () => this.checkDedicatedBlockSize();
      this.$scope.orderOrganisation = () => this.orderOrganisation();
      this.$scope.loadPrices = durations => this.loadPrices(durations);
      this.$scope.getDurations = () => this.getDurations();
      this.$scope.loadContracts = () => this.loadContracts();
      this.$scope.backToContracts = () => this.backToContracts();
      this.$scope.getResumePrice = price => this.getResumePrice(price);
      this.$scope.confirmOrder = () => this.confirmOrder();
    }

    /*= =============================
    =            STEP 1            =
    ============================== */

    getServices() {
      this.$scope.loading.services = true;

      return this.$q
        .all({
          servicesList: this.IpOrder.getServicesByType(),
          user: this.User.getUser(),
        })
        .then((results) => {
          this.$scope.servicesList = results.servicesList;
          this.$scope.user = results.user;
        })
        .catch((err) => {
          this.Alerter.alertFromSWS(this.$translate.instant('ip_order_loading_error'), err);
        })
        .finally(() => {
          this.$scope.loading.services = false;
        });
    }

    canServiceBeOrdered() {
      this.$scope.loading.serviceCanBeOrdered = true;
      this.$scope.orderableIp = null;
      this.$scope.orderableIpError = null;

      // First, check if option can be ordered
      return this.IpOrder
        .checkIfAllowed(this.$scope.model.service, 'ip')
        .then((serviceAllowed) => {
          if (!serviceAllowed) {
            this.$scope.orderableIpError = 'OPTION_NOT_ALLOWED';
            return { serviceIsAllowed: false };
          }

          return this.IpOrder.getServiceOrderableIp(this.$scope.model.service);
        })
        .then((infos) => {
          if (!infos) {
            this.$scope.orderableIpError = 'OUT';
            return null;
          }

          if (_.has(infos, 'serviceIsAllowed')) {
            return null;
          }

          const hasIPv4 = _.isArray(infos.ipv4) && !_.isEmpty(infos.ipv4);
          const hasIPv6 = _.isArray(infos.ipv6) && !_.isEmpty(infos.ipv6);

          if (this.$scope.model.service.serviceType === 'DEDICATED' && !(hasIPv4 || hasIPv6)) {
            this.$scope.orderableIpError = 'OPTION_NOT_ALLOWED';
            return null;
          }

          this.$scope.orderableIp = infos;

          if (this.$scope.model.service.serviceType === 'PCC') {
            return this.DedicatedCloud
              .getDescription(this.$scope.model.service.serviceName)
              .then(({ generation }) => {
                this.$scope.model.service.usesAgora = generation === '2.0';
              });
          }

          return null;
        })
        .catch((data) => {
          if (data.status === 460) {
            this.$scope.orderableIpError = 'EXPIRED';
          } else {
            this.Alerter.alertFromSWS(this.$translate.instant('ip_order_loading_error'), data.data);
          }
        })
        .finally(() => {
          this.$scope.loading.serviceCanBeOrdered = false;
        });
    }

    /* ==============================
    =            STEP 2            =
    ============================== */

    loadOrderForm() {
      const queue = [];
      this.$scope.loading.form = true;

      // Reset model params!
      this.$scope.model.params = {};

      if (this.$scope.model.service.serviceType === 'DEDICATED') {
        this.$scope.model.params.type = 'failover';
      }

      queue.push(
        this.IpOrder
          .getAvailableCountries(this.$scope.model.service)
          .then((countries) => {
            this.$scope.orderableIp.countries = countries.map(countryCode => ({
              code: countryCode,
              displayValue: this.$translate.instant(`country_${countryCode.toUpperCase()}`),
            }));
          })
          .catch((error) => {
            if (this.$scope.model.service.serviceType === 'PCC' && this.$scope.model.service.usesAgora) {
              return null;
            }

            return this.$q.reject(error);
          }),
      );

      if (this.$scope.model.service.serviceType === 'PCC') {
        queue.push(
          this.Ip
            .getOrderModels()
            .then((models) => {
              this.$scope.orderableIp.size = models['dedicatedCloud.OrderableIpBlockRangeEnum'].enum;
            }),
        );

        if (this.$scope.model.service.usesAgora) {
          queue.push(
            this.IpAgoraOrder
              .getIpOffers(this.$scope.user.ovhSubsidiary)
              .then((offers) => {
                this.$scope.orderableIp.countries = _.uniq(
                  _.flatten(
                    _.map(
                      offers,
                      offer => offer.details.product.configurations.find(config => config.name === 'country').values,
                    ),
                  ),
                )
                  .map(countryCode => ({
                    code: countryCode,
                    displayValue: this.$translate.instant(`country_${countryCode.toUpperCase()}`),
                  }))
                  .sort();

                this.a = 'pouet';
              }),
          );
        }
      } else if (this.$scope.model.service.serviceType === 'DEDICATED') {
        // Check if it is a BHS server
        queue.push(
          this.IpOrder
            .checkIfCanadianServer(this.$scope.model.service.serviceName)
            .then((isCanadianServer) => {
              this.$scope.orderableIp.isCanadianServer = isCanadianServer;
            }),
        );

        queue.push(
          this.IpOrganisation
            .getIpOrganisation()
            .then((organisations) => {
              this.$scope.orderableIp.ipOrganisation = organisations;
            }),
        );
      }

      return this.$q
        .all(queue)
        .then(() => {
          this.$scope.loading.form = false;
        })
        .catch((data) => {
          this.Alerter.alertFromSWS(this.$translate.instant('ip_order_loading_error'), _.get(data, 'data', data));
          this.$scope.loading.form = false;
        });
    }

    isMonthlyVps() {
      return this.$scope.model.service.serviceType === 'VPS'
        ? this.$scope.orderableIp && this.$scope.orderableIp.vpsInfos.model && this.$scope.orderableIp.vpsInfos.model.version !== '2015v1'
        : false;
    }

    orderFormValid() {
      if (!this.$scope.orderableIp
  || !this.$scope.model.service
  || !this.$scope.model.service.serviceType
  || !this.$scope.model.params) {
        return false;
      }

      switch (this.$scope.model.service.serviceType) {
        case 'DEDICATED':
          if (!this.$scope.model.params.blockSize
      || (this.$scope.orderableIp.isCanadianServer
        ? this.$scope.model.params.blockSize === 1 && !this.$scope.model.params.country
        : !this.$scope.model.params.country)) {
            return false;
          }

          if (this.$scope.model.params.blockSize > 1 && !this.$scope.orderableIp.isCanadianServer) {
            // No orga in CA
            return !!this.$scope.model.params.organisationId;
          }

          return true;
        case 'PCC':
          return (
            this.$scope.model.params.size
        && this.$scope.model.params.country
        && this.$scope.model.params.networkName
        && /^[a-zA-Z]+\w+$/.test(this.$scope.model.params.networkName)
        && this.$scope.model.params.estimatedClientsNumber
        && this.$scope.model.params.description
        && this.$scope.model.params.usage
          );
        case 'VPS':
          return this.$scope.model.params.country && this.$scope.model.params.number;
        default:
          return null;
      }
    }

    checkDedicatedBlockSize() {
      if (this.$scope.model.params && this.$scope.model.params.blockSize === 1) {
        delete this.$scope.model.params.organisationId;
      }
    }

    orderOrganisation() {
      this.$rootScope.$broadcast('ips.display', 'organisation');
      this.$scope.resetAction();
    }

    /*= =============================
    =            STEP 3            =
    ============================== */

    loadPrices(durations) {
      this.$scope.loading.prices = true;

      const queue = durations.map(duration => this.IpOrder
        .getOrderForDuration(this.$scope.model.service, this.$scope.model.params, duration)
        .then((details) => {
          this.$scope.durations.details[duration] = details;
        }));

      return this.$q
        .all(queue)
        .then(() => {
          if (durations && durations.length === 1) {
            this.$scope.model.duration = _.first(durations);
          }

          this.$scope.loading.prices = false;
        });
    }

    getDurations() {
      const queue = [];
      let needProfessionalUse = false;
      this.Alerter.resetMessage(this.alertId);

      this.$scope.durations = {
        available: null,
        details: {},
      };

      this.$scope.model.duration = null;
      this.$scope.orderableIp.professionalUsePrice = null;
      this.$scope.loading.durations = true;

      if (this.$scope.orderableIp.isCanadianServer && this.$scope.model.params.blockSize > 1) {
        this.$scope.model.params.country = _.first(this.$scope.orderableIp.countries) || 'ca'; // Forced :'( ...
      }

      queue.push(
        this.IpOrder
          .getOrder(this.$scope.model.service, this.$scope.model.params)
          .then((durations) => {
            this.$scope.durations.available = durations;
            this.loadPrices(durations);
          }),
      );

      if (this.$scope.model.service.serviceType === 'DEDICATED') {
        angular.forEach(this.$scope.orderableIp.ipv4, (ip) => {
          if (ip.blockSizes && ip.blockSizes.length && ~ip.blockSizes.indexOf(this.$scope.model.params.blockSize) && ip.optionRequired === 'professionalUse') {
            needProfessionalUse = true;
          }
        });

        if (needProfessionalUse) {
          queue.push(
            this.IpOrder
              .getProfessionalUsePrice(this.$scope.model.service.serviceName)
              .then((price) => {
                this.$scope.orderableIp.professionalUsePrice = price;
              }),
          );
        }
      }

      return this.$q
        .all(queue)
        .then(() => {
          this.$scope.loading.durations = false;
        })
        .catch((err) => {
          this.Alerter.error(this.$translate.instant('ip_order_loading_error2', {
            t0: err.data ? err.data.message : err.message,
          }), this.alertId);

          this.$scope.loading.durations = false;
        });
    }

    /*= =============================
    =            STEP 4            =
    ============================== */

    loadContracts() {
      this.$scope.agree.value = false;
      if (!this.$scope.durations.details[this.$scope.model.duration].contracts
  || !this.$scope.durations.details[this.$scope.model.duration].contracts.length) {
        this.$rootScope.$broadcast('wizard-goToStep', 6);
      }
    }

    backToContracts() {
      if (!this.$scope.durations.details[this.$scope.model.duration].contracts
  || !this.$scope.durations.details[this.$scope.model.duration].contracts.length) {
        this.s$rootScope.$broadcast('wizard-goToStep', 3);
      }
    }

    /*= =============================
    =            STEP 5            =
    ============================== */

    getResumePrice(price) {
      return price.value === 0
        ? this.$translate.instant('price_free')
        : this.$translate.instant('price_ht_label', { t0: price.text });
    }

    confirmOrder() {
      this.$scope.loading.validation = true;

      return this.IpOrder
        .postOrder(this.$scope.model.service, this.$scope.model.params, this.$scope.model.duration)
        .then((order) => {
          this.Alerter.alertFromSWS(this.$translate.instant('ip_order_finish_success', {
            t0: order.url,
            t1: order.orderId,
          }), { idTask: order.orderId, state: 'OK' });

          this.$window.open(order.url, '_blank');
        })
        .catch((data) => {
          this.Alerter.alertFromSWS(this.$translate.instant('ip_order_finish_error'), data.data);
        })
        .finally(() => {
          this.$scope.resetAction();
        });
    }
  });
