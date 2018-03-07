angular.module("App").controller("ovhTaskFollowCtrl", function ($scope, $q, $http, $interval) {
    "use strict";

    const self = this;
    let taksInfoPollPromise = null;

    self.data = {
        alert: null,
        tasks: null
    };

    self.loading = {
        init: false
    };

    /*= ==============================
    =            HELPERS            =
    ===============================*/

    function getTaskInfo () {
        return $http
            .get("/ovh-tasks", {
                serviceType: "aapi"
            })
            .then((response) => {
                if (_.isEmpty(response)) {
                    self.data.alerts = null;
                    self.data.tasks = [];
                } else {
                    self.data.alerts = _.get(response, "data.alerts", "");
                    self.data.tasks = _.map(_.get(response, "data.tasks", []), (task) => {
                        task.comments = _.map(task.comments, (comment) => {
                            comment.comment_text = _.get(comment, "comment_text", "")
                                .replace(/\\'/g, "'")
                                .replace(/\\"/g, '"');
                            return comment;
                        }).reverse();
                        task.detailed_desc = _.get(task, "detailed_desc", "")
                            .replace(/\\'/g, "'")
                            .replace(/\\"/g, '"');
                        return task;
                    });
                }
            });
    }

    self.getAlerts = function () {
        const lg = _.get(localStorage, "univers-selected-language", "en_GB");
        return _.map(self.data.alerts, (alert) => _.get(alert, lg, _.get(alert, "en_GB")));
    };

    /* -----  End of HELPERS  ------*/

    /*= =============================
    =            EVENTS            =
    ==============================*/

    self.close = function () {
        self.data.alert = null;
        self.data.tasks = [];
        $interval.cancel(taksInfoPollPromise);
    };

    /* -----  End of EVENTS  ------*/

    /*= =====================================
    =            INITIALIZATION            =
    ======================================*/

    /* ----------  Component initialization  ----------*/

    self.$onInit = function () {
        self.loading.init = true;

        return $q
            .all({
                task: getTaskInfo()
            })
            .then(
                () => {
                    taksInfoPollPromise = $interval(getTaskInfo, 60000);
                },
                () => {
                    taksInfoPollPromise = $interval(getTaskInfo, 60000);
                }
            )
            .finally(() => {
                self.loading.init = false;
            });
    };

    /* -----  End of INITIALIZATION  ------*/
});
