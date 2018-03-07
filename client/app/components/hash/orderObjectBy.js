angular.module("filters").filter("orderObjectBy", () => {
    "use strict";

    return function (arr, prop) {
        return _.sortBy(arr, prop);
    };
});
