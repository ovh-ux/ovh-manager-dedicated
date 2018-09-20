angular.module('directives').directive('workingStatus', [
  '$timeout',
  'Products',
  function ($timeout, Products) {
    return {
      restrict: 'A',
      scope: {
        modalId: '=',
        worksDetails: '=',
        productType: '=',
        showAffiliated: '=',
        showOnlyActive: '=',
        tr: '=',
      },
      templateUrl: 'components/working-status/working-status.html',
      controller: [
        '$scope',
        function (scope) {
          if (scope.productType) {
            Products.getWorks(scope.productType, scope.showAffiliated, scope.showOnlyActive).then((works) => {
              scope.worksDetails = works.items;
            });
          }

          scope.closeModal = function () {
            scope.openListModal(false);
          };

          scope.openListModal = function (data) {
            scope.currentActionData = data;
            if (scope.currentActionData) {
              scope.worksStepPath = 'components/working-status/working-status-modal.html';
              $(`#${scope.modalId}`).modal({
                keyboard: true,
                backdrop: 'static',
              });
            } else {
              $(`#${scope.modalId}`).modal('hide');
              scope.currentActionData = null;
            }
          };
        },
      ],
    };
  },
]);
