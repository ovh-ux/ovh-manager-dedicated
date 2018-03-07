angular.module("Module.ip.filters").filter("ipFirewallRulePort", () => {
    "use strict";

    return function (port) {
        return (port && port.replace(/^eq /, "")) || "";
    };
});
