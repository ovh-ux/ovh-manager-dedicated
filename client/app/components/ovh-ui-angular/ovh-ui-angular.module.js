angular.module("App").run(($q, $translate, ouiFieldConfiguration) => {

    $q.all({
        required: $translate("common_field_error_required"),
        number: $translate("common_field_error_number"),
        email: $translate("common_field_error_email"),
        min: $translate("common_field_error_min", { min: "{{min}}" }),
        max: $translate("common_field_error_max", { max: "{{max}}" }),
        minlength: $translate("common_field_error_minlength", { minlength: "{{minlength}}" }),
        maxlength: $translate("common_field_error_maxlength", { maxlength: "{{maxlength}}" }),
        pattern: $translate("common_field_error_pattern")
    }).then((results) => {
        ouiFieldConfiguration.translations = {
            errors: results
        };
    });

});
