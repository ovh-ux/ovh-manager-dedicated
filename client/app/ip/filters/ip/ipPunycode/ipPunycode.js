angular.module("Module.ip.filters").filter("ipPunycode", () => {
    "use strict";

    return function (reverse, decode) {
        return reverse ? punycode[decode ? "toUnicode" : "toASCII"](reverse) : "";
    };
});
