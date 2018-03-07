angular
    .module("Module.license", [
        "ovh-utils-angular",
        "ngRoute",
        "ui.bootstrap",
        "ngSanitize",
        "Module.license.controllers",
        "Module.license.services"
    ])
    .run((translator) => translator.load(["license"]));
