import _ from 'lodash';

export default class {
  /* @ngInject */
  constructor(
    $element,
    $timeout,
  ) {
    this.$element = $element;
    this.$timeout = $timeout;
  }

  $postLink() {
  // Sometimes the digest cycle is done before dom manipulation,
  // So we use $timeout to force the $apply
    this.$timeout(() => {
      this.selectedItem = _.find(
        this.servicePacks,
        { name: _.get(this.defaultValue, 'name') },
      );

      if (this.selectedItem) {
        this.handleOnChange();
      }

      this
        .$element
        .addClass('d-block');
    });
  }

  handleOnChange() {
    if (this.onChange) {
      this.onChange({ selectedItem: this.selectedItem });
    }
  }
}