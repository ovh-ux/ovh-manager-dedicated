angular.module("App").component("ouiMessageAlerter", {
    templateUrl: "components/oui-message-alerter/oui-message-alerter.html",
    controller: "OuiMessageAlerterCtrl",
    bindings: {
        context: "<",
        isSameContext: "&"
    }
});
