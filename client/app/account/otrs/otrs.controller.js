angular.module('Module.otrs.controllers').controller('otrsCtrl', [
  '$rootScope',
  '$scope',
  '$location',
  '$translate',
  'OtrsPopupService',
  'Module.otrs.services.otrs',
  'Alerter',
  'constants',
  'OTRS_POPUP_UNIVERSES',
  function ($rootScope, $scope, $location, $translate, OtrsPopupService, Otrs, Alerter, constants,
    OTRS_POPUP_UNIVERSES) {
    let firstLoading = false;

    $scope.itemsPerPage = 10;
    $scope.today = new Date();
    $scope.minCreationDateSearch = {
      opened: false,
    };
    $scope.maxCreationDateSearch = {
      opened: false,
    };
    $scope.worldPart = constants.target;
    $scope.showFilters = false;
    $scope.currentPage = $location.search()
      && $location.search().currentPage != null ? parseInt($location.search().currentPage, 10) : 1;
    $scope.selectedLanguage = $scope.selectedLanguage || { value: 'fr_FR' };

    function loadSearch() {
      if (!sessionStorage) {
        return;
      }
      if (sessionStorage.getItem('OVH_SUPPORT_FILTERS')) {
        $scope.search = JSON.parse(sessionStorage.getItem('OVH_SUPPORT_FILTERS'));
        $scope.showFilters = true;
      }
    }

    $scope.init = function () {
      $scope.loaders = {
        tickets: true,
        services: false,
      };
      $scope.search = {
        minCreationDate: null,
        maxCreationDate: null,
        serviceName: null,
        status: null,
        subject: null,
      };

      $scope.tickets = {
        ids: [],
        detail: [],
      };

      $scope.list = {
        services: [],
        status: [],
      };

      $scope.selection = {
        universe: null,
      };

      Otrs.getModels()
        .then(
          (models) => {
            $scope.types = models.models['support.TicketTypeEnum'].enum;
            $scope.categories = models.models['support.TicketProductEnum'].enum;
            $scope.requests = models.models['support.TicketCategoryEnum'].enum;
          },
          (err) => {
            Alerter.alertFromSWS($translate.instant('otrs_popup_get_types_error'), err, 'otrs_popup_sent');
          },
        )
        .finally(() => {
          $scope.loaders.models = false;
        });

      $scope.universes = OTRS_POPUP_UNIVERSES[constants.target];

      loadSearch();
    };

    function saveSearch() {
      if (!sessionStorage) {
        return;
      }
      if (angular.equals($scope.search, {
        minCreationDate: null,
        maxCreationDate: null,
        serviceName: null,
        status: null,
        subject: null,
      })) {
        sessionStorage.removeItem('OVH_SUPPORT_FILTERS');
      } else {
        sessionStorage.setItem('OVH_SUPPORT_FILTERS', JSON.stringify($scope.search));
      }
    }

    $scope.$watch(
      'search',
      _.debounce(() => {
        Alerter.resetMessage('otrs-popup-search');

        if ($scope.search.subject !== null
          && $scope.search.subject.length > 0
          && $scope.search.subject.length < 3) {
          return;
        }
        saveSearch();
        $scope.$apply(() => {
          $scope.getTicketsIds();
        });
      }, 1000),
      true,
    );

    $scope.getTicketsIds = function () {
      $scope.loaders.tickets = true;

      const filters = angular.copy($scope.search);
      if (filters.selectedService) {
        filters.serviceName = filters.selectedService.serviceName;
        delete filters.selectedService;
      }

      filters.status = filters.status === '' ? null : filters.status;

      if (filters.subject) {
        filters.subject = window.encodeURIComponent(filters.subject);
      }

      if (_.isDate(filters.minCreationDate)) {
        filters.minCreationDate = moment(filters.minCreationDate).format();
      }
      if (_.isDate(filters.maxCreationDate)) {
        filters.maxCreationDate = moment(filters.maxCreationDate).format();
      }

      return Otrs.getTickets(filters)
        .then(
          (table) => {
            $scope.tickets.ids = table;
          },
          (err) => {
            Alerter.alertFromSWS($translate.instant('otrs_table_ticket_error'), err);
          },
        )
        .finally(() => {
          $scope.loaders.tickets = false;
        });
    };

    $scope.transformItem = function (ticket) {
      $scope.loaders.tickets = true;

      return Otrs.getTicket(ticket).then((_ticket) => {
        const serviceDescription = $scope.getServiceDescription(_ticket);
        if (serviceDescription) {
          _.set(_ticket, 'serviceDescription', serviceDescription);
        }
        return _ticket;
      });
    };

    $scope.getServiceDescription = function (ticket) {
      let description;
      let serviceMap;

      if ($scope.list.services.length > 0) {
        serviceMap = _.find(
          $scope.list.services,
          service => service.serviceName === ticket.serviceName,
        );

        if (serviceMap) {
          description = serviceMap.serviceDescription;
        }
      }

      return description;
    };

    $scope.onTransformItemDone = function () {
      $scope.loaders.tickets = false;
      if (!firstLoading) {
        $scope.currentPage = $location.search() && $location.search().currentPage != null
          ? parseInt($location.search().currentPage, 10)
          : 1;
        $scope.refreshTable = !$scope.refreshTable;
        firstLoading = true;
      }
    };

    $scope.getServices = function () {
      $scope.list.services = [];
      if (!$scope.selection.universe) {
        return;
      }

      $scope.loaders.services = true;
      Otrs.getServices({
        includeInactives: true,
        universe: $scope.selection.universe,
      })
        .then(
          (data) => {
            _.each(data.results, (category) => {
              if (_.contains(Otrs.noAvailableService, category.name)) {
                return;
              }

              $scope.list.services.push(
                ..._.map(category.services, (service) => {
                  _.set(service, 'category', category.name);
                  _.set(service, 'serviceDescription', service.displayName);
                  return service;
                }),
              );
            });

            if ($location.search() && $location.search().serviceName) {
              $scope.search.selectedService = _.find(
                $scope.list.services,
                service => service.serviceName === $location.search().serviceName,
              );
            }
          },
          (err) => {
            Alerter.alertFromSWS($translate.instant('otrs_search_ticket_get_services_error'), err, 'otrs_popup_service');
          },
        )
        .finally(() => {
          $scope.loaders.services = false;
        });
    };

    $scope.openDialog = function () {
      if (!OtrsPopupService.isLoaded()) {
        OtrsPopupService.init();
      } else {
        OtrsPopupService.toggle();
      }
    };

    $scope.goTo = function (url) {
      $location.path(url).search({ previousPage: $scope.currentPage });
    };

    $rootScope.$on('ticket.otrs.reload', $scope.getTicketsIds);

    $scope.minCreationDate = function () {
      $scope.minCreationDateSearch.opened = true;
    };

    $scope.maxCreationDate = function () {
      $scope.maxCreationDateSearch.opened = true;
    };

    $scope.init();
  },
]);
