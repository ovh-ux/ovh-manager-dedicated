angular.module("AngularExtensions").config([
    "$provide",
    function ($provide) {
        "use strict";

        $provide.decorator("$q", [
            "$delegate",
            function ($delegate) {
                const $q = $delegate;

                // Can't name it allSettled since dedicated-front import ovh-q-allSettled that clash with it. We
                // don't use this library becaues it has been deprecated and we can't get any error messages.
                // TODO: Find a way to replace this with the official Q library
                // https://github.com/kriskowal/q/wiki/API-Reference
                $q.portalAllSettled =
                    $q.portalAllSettled ||
                    function (promises) {
                        function wrapPromise (promise) {
                            return $q
                                .when(promise)
                                .then((result) => ({ resolved: true, value: result }))
                                .catch((error) =>
                                    // jscs:ignore requireDotNotation
                                    ({ resolved: false, error })
                                );
                        }

                        const wrappedPromises = [];

                        angular.forEach(promises, (promise, key) => {
                            if (!wrappedPromises.hasOwnProperty(key)) {
                                wrappedPromises[key] = wrapPromise(promise);
                            }
                        });

                        return $q.all(wrappedPromises);
                    };

                return $q;
            }
        ]);
    }
]);
