/**
 * Provides an alternative if key to translate does not exists.
 * Example :
 *
 *   'my_key' | translateAlt: 'foo'
 *   will resolve to 'foo' if 'my_key' could not be translated
 *
 *   'my_key' | translateAlt: ('my_other_key' | translate)
 *   you can use any valid angular expression as alternative value
 */
angular.module('filters').filter('translateAlt', $translate => function (toTranslate, alternative) {
  const translated = $translate.instant(toTranslate);
  return translated === toTranslate ? alternative : translated;
});
