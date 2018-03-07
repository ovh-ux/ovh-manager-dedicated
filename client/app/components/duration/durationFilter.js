angular.module("filters").filter("duration", [
    "translator",
    "$filter",
    function (translator, $filter) {
        "use strict";

        const unitHash = {
            m: "month",
            d: "day",
            j: "day",
            y: "year",
            a: "year"
        };
        const simpleDurationReg = /(^[0-9]+)([mdjya]?)$/;
        const upto = /^upto/;
        const uptoDuration = /(^upto-)([0-9]{4}-[0-9]{2}-[0-9]{2}?$)/;
        const engage = /(^engage)([0-9]+)([mdjya]?)$/;

        return function parseDuration (duration, dateFormat) {
            let d;
            let unit;

            if (simpleDurationReg.test(duration)) {
                d = +duration.match(simpleDurationReg)[1];
                unit = unitHash[duration.match(simpleDurationReg)[2] || "m"];
                return translator.trpl(unit, d);
            } else if (upto.test(duration)) {
                if (uptoDuration.test(duration)) {
                    d = duration.match(uptoDuration)[2];
                    return translator.tr("upto", dateFormat ? $filter("date")(d, dateFormat) : d);
                }
                return translator.tr("uptofirstdaynextmonth");
            } else if (engage.test(duration)) {
                d = +duration.match(engage)[2];
                unit = unitHash[duration.match(engage)[3] || "m"];
                return translator.tr("engage", translator.trpl(unit, d));
            }
            return duration;
        };
    }
]);
