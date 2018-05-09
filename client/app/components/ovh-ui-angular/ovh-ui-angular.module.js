angular.module("App").run(($q, $translate, $translatePartialLoader, ouiFieldConfiguration) => {

    // first be sure that common translation file is loaded...
    $translatePartialLoader.addPart("common");
    $translate.refresh().then(() => {
        // set ouiField error messages
        ouiFieldConfiguration.translations = {
            errors: {
                required: $translate.instant("common_field_error_required"),
                number: $translate.instant("common_field_error_number"),
                email: $translate.instant("common_field_error_email"),
                min: $translate.instant("common_field_error_min", { min: "{{min}}" }),
                max: $translate.instant("common_field_error_max", { max: "{{max}}" }),
                minlength: $translate.instant("common_field_error_minlength", { minlength: "{{minlength}}" }),
                maxlength: $translate.instant("common_field_error_maxlength", { maxlength: "{{maxlength}}" }),
                pattern: $translate.instant("common_field_error_pattern")
            }
        };
    });

});
