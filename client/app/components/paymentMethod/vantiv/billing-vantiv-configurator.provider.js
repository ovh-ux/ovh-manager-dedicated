angular.module('services').provider(
  'BillingVantivConfigurator',
  class BillingVantivConfigurator {
    /* eslint-disable class-methods-use-this */
    setScriptUrl(url) {
      const script = document.createElement('script');
      script.setAttribute('src', url);
      script.setAttribute('type', 'text/javascript');

      document.body.appendChild(script);
    }

    $get() {
      return null;
    }
    /* eslint-enable class-methods-use-this */
  },
);
