angular.module("App").run(($q, $translate, $translatePartialLoader, ouiFieldConfiguration, ouiStepperConfiguration) => {

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

        // set ouiStepper default translations
        ouiStepperConfiguration.translations = {
            optionalLabel: $translate.instant("common_stepper_optional_label"),
            modifyThisStep: $translate.instant("common_stepper_modify_this_step"),
            skipThisStep: $translate.instant("common_stepper_skip_this_step"),
            nextButtonLabel: $translate.instant("common_stepper_next_button_label"),
            submitButtonLabel: $translate.instant("common_stepper_submit_button_label"),
            cancelButtonLabel: $translate.instant("common_stepper_cancel_button_label")
        };
    });

});
