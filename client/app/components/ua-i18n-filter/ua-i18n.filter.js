function translateFilter (translator) {
    "use strict";
    return (translationId, interpolateParams) => translator.tr(translationId, interpolateParams);
}

angular.module("App").filter("UAi18n", translateFilter);
