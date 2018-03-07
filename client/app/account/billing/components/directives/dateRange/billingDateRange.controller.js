angular.module("Billing.directives").controller("Billing.directives.billingDateRangeCtrl", [
    "$scope",
    "$timeout",
    "translator",
    "BillingdateRangeSelection",
    function ($scope, $timeout, translator, dateRangeSelection) {
        "use strict";

        $scope.tr = translator.tr;

        this.today = moment();
        this.CUSTOM_RANGE_MODE = "custom";
        this.model = {};
        this.dateRangeSelection = dateRangeSelection;

        this.presets = [
            {
                id: "3M",
                label: translator.tr("common_time_period_in_months", [3]),
                args: [3, "months"],
                startOf: "month"
            },
            {
                id: "6M",
                label: translator.tr("common_time_period_in_months", [6]),
                args: [6, "months"],
                startOf: "month"
            },
            {
                id: "1Y",
                label: translator.tr("common_time_period_one_year"),
                args: [1, "years"],
                startOf: "month"
            }
        ];

        this.dateFromChanged = ({ dateFrom }) => {
            dateRangeSelection.dateFrom = moment(dateFrom).startOf("day");
            if (moment(dateRangeSelection.dateFrom).isAfter(dateRangeSelection.dateTo)) {
                dateRangeSelection.dateTo = dateRangeSelection.dateFrom.endOf("day");
            }
            this.triggerChangeHandler();
        };

        this.dateToChanged = ({ dateTo }) => {
            dateRangeSelection.dateTo = moment(dateTo).endOf("day");
            if (moment(dateRangeSelection.dateTo).isBefore(dateRangeSelection.dateFrom)) {
                dateRangeSelection.dateFrom = dateRangeSelection.dateTo.startOf("day");
            }
            this.triggerChangeHandler();
        };

        this.onPresetBtn = (preset) => {
            dateRangeSelection.mode = preset.id;
            this.applyPreset(preset);
            this.triggerChangeHandler();
        };

        this.applyPreset = (preset) => {
            dateRangeSelection.dateFrom = moment()
                .subtract(...preset.args)
                .startOf(preset.startOf);

            dateRangeSelection.dateTo = moment().endOf("day");
        };

        this.onCustomRangeBtn = () => {
            dateRangeSelection.mode = this.CUSTOM_RANGE_MODE;
        };

        this.triggerChangeHandler = () => {
            if (angular.isFunction(this.onChange)) {
                $timeout(() => {
                    this.onChange(dateRangeSelection);
                });
            }
        };

        /**
         * Initialisation
         */
        (function init (_self) {
            if (dateRangeSelection.mode === _self.CUSTOM_RANGE_MODE) {
                return;
            }

            let preset = _self.presets.find((_preset) => _preset.id === dateRangeSelection.mode);
            if (!preset) {
                preset = _self.presets[0];
                dateRangeSelection.mode = preset.id;
            }

            _self.applyPreset(preset);
        })(this);
    }
]);
