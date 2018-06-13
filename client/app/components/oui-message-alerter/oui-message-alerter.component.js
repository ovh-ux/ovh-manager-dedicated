angular.module("App").directive("ouiMessageAlerter", ($timeout, $window) => ({
    restrict: "E",
    templateUrl: "components/oui-message-alerter/oui-message-alerter.html",
    controller: "OuiMessageAlerterCtrl",
    controllerAs: "$ctrl",
    bindToController: true,
    link: (scope, element, attributes, ctrl) => {
        const duration = 250;
        const delay = 500;
        const offset = 100;

        ctrl.applyAutoScroll = () => {
            if ($window.scrollY > element.offset().top - offset) {
                $(".container-fluid[data-ui-view='app']").eq(0).delay(delay).animate({
                    scrollTop: Math.max(0, element.offset().top - offset)
                }, duration);
            }
        };
    },
    scope: {
        context: "<",
        isSameContext: "&",
        autoScroll: "<"
    }
}));
