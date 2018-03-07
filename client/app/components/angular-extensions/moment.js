angular.module("AngularExtensions").service("moment", [
    "translator",
    function (translator) {
        "use strict";

        const language = translator.getSelectedAvailableLanguage().value.split("_")[0];
        const moment = window.moment;
        if (moment.locale !== undefined) {
            moment.locale(language); // 2.8.1+
        } else {
            moment.lang(language);
        }

        return moment;
    }
]);
