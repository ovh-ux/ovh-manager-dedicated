angular.module('App').run(($q,
  $translate,
  $translatePartialLoader,
  ouiCriteriaAdderConfiguration,
  ouiDatagridConfiguration,
  ouiFieldConfiguration,
  ouiNavbarConfiguration,
  ouiPaginationConfiguration,
  ouiStepperConfiguration) => {
  // first be sure that common translation file is loaded...
  $translatePartialLoader.addPart('common');
  $translate.refresh().then(() => {
    _.set(ouiCriteriaAdderConfiguration, 'translations', {
      column_label: $translate.instant('common_criteria_adder_column_label'),
      operator_label: $translate.instant('common_criteria_adder_operator_label'),

      operator_boolean_is: $translate.instant('common_criteria_adder_operator_boolean_is'),
      operator_boolean_isNot: $translate.instant('common_criteria_adder_operator_boolean_isNot'),

      operator_string_contains: $translate.instant('common_criteria_adder_operator_string_contains'),
      operator_string_containsNot: $translate.instant('common_criteria_adder_operator_string_containsNot'),
      operator_string_startsWith: $translate.instant('common_criteria_adder_operator_string_startsWith'),
      operator_string_endsWith: $translate.instant('common_criteria_adder_operator_string_endsWith'),
      operator_string_is: $translate.instant('common_criteria_adder_operator_string_is'),
      operator_string_isNot: $translate.instant('common_criteria_adder_operator_string_isNot'),

      operator_number_is: $translate.instant('common_criteria_adder_operator_number_is'),
      operator_number_smaller: $translate.instant('common_criteria_adder_operator_number_smaller'),
      operator_number_bigger: $translate.instant('common_criteria_adder_operator_number_bigger'),

      operator_date_is: $translate.instant('common_criteria_adder_operator_date_is'),
      operator_date_isBefore: $translate.instant('common_criteria_adder_operator_date_isBefore'),
      operator_date_isAfter: $translate.instant('common_criteria_adder_operator_date_isAfter'),

      operator_options_is: $translate.instant('common_criteria_adder_operator_options_is'),
      operator_options_isNot: $translate.instant('common_criteria_adder_operator_options_isNot'),

      true_label: $translate.instant('common_criteria_adder_true_label'),
      false_label: $translate.instant('common_criteria_adder_false_label'),

      value_label: $translate.instant('common_criteria_adder_value_label'),
      submit_label: $translate.instant('common_criteria_adder_submit_label'),
    });

    _.set(ouiDatagridConfiguration, 'translations', {
      emptyPlaceholder: $translate.instant('common_datagrid_nodata'),
    });

    // set ouiField error messages
    _.set(ouiFieldConfiguration, 'translations', {
      errors: {
        required: $translate.instant('common_field_error_required'),
        number: $translate.instant('common_field_error_number'),
        email: $translate.instant('common_field_error_email'),
        min: $translate.instant('common_field_error_min', { min: '{{min}}' }),
        max: $translate.instant('common_field_error_max', { max: '{{max}}' }),
        minlength: $translate.instant('common_field_error_minlength', { minlength: '{{minlength}}' }),
        maxlength: $translate.instant('common_field_error_maxlength', { maxlength: '{{maxlength}}' }),
        pattern: $translate.instant('common_field_error_pattern'),
      },
    });

    _.set(ouiNavbarConfiguration, 'translations', {
      notification: {
        errorInNotification: $translate.instant('common_navbar_notification_error_in_notification'),
        errorInNotificationDescription: $translate.instant('common_navbar_notification_error_in_notification_description'),
        markRead: $translate.instant('common_navbar_notification_mark_as_read'),
        markUnread: $translate.instant('common_navbar_notification_mark_as_unread'),
        noNotification: $translate.instant('common_navbar_notification_none'),
        noNotificationDescription: $translate.instant('common_navbar_notification_none_description'),
      },
    });

    _.set(ouiPaginationConfiguration, 'translations', {
      resultsPerPage: $translate.instant('common_pagination_resultsperpage'),
      ofNResults: $translate.instant('common_pagination_ofnresults')
        .replace('TOTAL_ITEMS', '{{totalItems}}'),
      currentPageOfPageCount: $translate.instant('common_pagination_currentpageofpagecount')
        .replace('CURRENT_PAGE', '{{currentPage}}')
        .replace('PAGE_COUNT', '{{pageCount}}'),
      previousPage: $translate.instant('common_pagination_previous'),
      nextPage: $translate.instant('common_pagination_next'),
    });

    _.set(ouiStepperConfiguration, 'translations', {
      optionalLabel: $translate.instant('common_stepper_optional_label'),
      modifyThisStep: $translate.instant('common_stepper_modify_this_step'),
      skipThisStep: $translate.instant('common_stepper_skip_this_step'),
      nextButtonLabel: $translate.instant('common_stepper_next_button_label'),
      submitButtonLabel: $translate.instant('common_stepper_submit_button_label'),
      cancelButtonLabel: $translate.instant('common_stepper_cancel_button_label'),
    });
  });
});
