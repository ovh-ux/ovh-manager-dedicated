/**
 * @type filter
 * @name filters:capacity
 */

angular.module("filters").filter("capacity", ($translate) => {
    "use strict";

    /* eslint-disable no-restricted-properties */
    const unitsValues = [
        {
            unit: "KB",
            value: 1024
        },
        {
            unit: "MB",
            value: Math.pow(1024, 2)
        },
        {
            unit: "GB",
            value: Math.pow(1024, 3)
        },
        {
            unit: "TB",
            value: Math.pow(1024, 4)
        },
        {
            unit: "PB",
            value: Math.pow(1024, 5)
        },
        {
            unit: "EB",
            value: Math.pow(1024, 6)
        },
        {
            unit: "ZB",
            value: Math.pow(1024, 7)
        },
        {
            unit: "YB",
            value: Math.pow(1024, 8)
        }
    ];
    /* eslint-enable no-restricted-properties */

    function getValueAndUnitForToUnit (bytes, precision, toUnit) {
        let i;
        let ii;
        let value = bytes; // Bytes by default
        const unit = $translate.instant("unit_size_B"); // Bytes by default

        if (toUnit !== $translate.instant("unit_size_B")) {
            for (i = 0, ii = unitsValues.length; i < ii; i++) {
                if (toUnit === $translate.instant(`unit_size_${unitsValues[i].unit}`)) {
                    value = (bytes / unitsValues[i].value).toFixed(precision);
                    break;
                }
            }
        }

        return { value, unit };
    }

    function getValueAndUnit (bytes, precision) {
        let i;
        let ii;
        let value = bytes; // Bytes by default
        let unit = $translate.instant("unit_size_B"); // Bytes by default
        const absBytes = Math.abs(bytes);

        for (i = 0, ii = unitsValues.length; i < ii; i++) {
            if (absBytes >= unitsValues[i].value && (angular.isDefined(unitsValues[i + 1]) ? absBytes < unitsValues[i + 1].value : true)) {
                value = (bytes / unitsValues[i].value).toFixed(precision);
                unit = $translate.instant(`unit_size_${unitsValues[i].unit}`);
                break;
            }
        }

        return { value, unit };
    }

    return function (bytes, _mode, _precision, toUnit) {
        let mode = _mode;
        let precision = _precision;

        /**
         * /!\
         * This is the rework to be OK with grunt-complexity. New code not tested ! Go GIT history for previous code.
         */

        let valueAndUnit = {};

        if (!angular.isNumber(precision)) {
            precision = 0;
        }

        if ($.inArray(mode, ["value", "unit"]) === -1) {
            mode = null;
        }

        if (toUnit) {
            valueAndUnit = getValueAndUnitForToUnit(bytes, precision, toUnit);
        } else {
            valueAndUnit = getValueAndUnit(bytes, precision);
        }

        //
        if (mode === "value") {
            return valueAndUnit.value;
        } else if (mode === "unit") {
            return valueAndUnit.unit;
        }
        return `${valueAndUnit.value} ${valueAndUnit.unit}`;
    };
});
