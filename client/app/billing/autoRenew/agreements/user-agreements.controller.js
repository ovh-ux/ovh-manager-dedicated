angular.module('UserAccount').controller('UserAccount.controllers.agreements', [
  '$scope',
  '$translate',
  'UserAccount.services.agreements',
  'Alerter',
  function ($scope, $translate, Service, Alerter) {
    function init() {
      $scope.loading = true;
      $scope.list = [];

      $scope.getToValidate();
    }

    $scope.loaders = {
      toActivate: true,
      toActivateList: true,
    };

    $scope.toActivate = [];

    $scope.agreed = {};

    $scope.loadAgreementsList = function (count, offset) {
      init();

      Service.getList(count, offset)
        .then((agreements) => {
          $scope.list = agreements;
        }, (err) => {
          Alerter.error(`${$translate.instant('user_agreements_error')} ${_.get(err, 'message') || err}`, 'agreements_alerter');
        })
        .then(() => {
          $scope.loading = false;
        });
    };

    $scope.getToValidate = function () {
      $scope.toActivate = [];
      $scope.loaders.toActivate = true;

      Service.getToValidate().then(
        (agreements) => {
          $scope.toActivate = agreements;
          $scope.loaders.toActivate = false;
        },
        angular.noop,
        (contract) => {
          $scope.toActivate.push(contract);
          $scope.agreed[contract.id] = false;
        },
      );
    };

    $scope.accept = function (contractId) {
      $scope.loaders[`accept_${contractId}`] = true;

      Service.accept(contractId).then(
        () => {
          $scope.getToValidate();
          $scope.$broadcast('paginationServerSide.reload', 'agreementsList');
        },
        (d) => {
          Alerter.set('alert alert-danger', d, d, 'agreements_alerter');
        },
      );
    };

    $scope.resetMessages = function () {
      Alerter.resetMessage('agreements_alerter');
    };
  },
]);
