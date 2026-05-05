/**
 * Chill Sip i18n — lightweight translation engine
 * Keys live in /locales/{lang}.json
 * Usage:  data-i18n="section.key"          → sets textContent
 *         data-i18n-html="section.key"      → sets innerHTML (for elements with nested tags)
 *         data-i18n-placeholder="section.key" → sets placeholder attribute
 * Switch: window.i18n.setLang('es')
 */
(function () {
  var STORAGE_KEY = 'rns-lang';
  var DEFAULT_LANG = 'en';
  var translations = {};
  var currentLang = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;

  function get(key) {
    return key.split('.').reduce(function (obj, k) {
      return obj && obj[k] !== undefined ? obj[k] : null;
    }, translations) || key;
  }

  function apply() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var v = get(el.getAttribute('data-i18n'));
      if (v && v !== el.getAttribute('data-i18n')) el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var v = get(el.getAttribute('data-i18n-html'));
      if (v && v !== el.getAttribute('data-i18n-html')) el.innerHTML = v;
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var v = get(el.getAttribute('data-i18n-placeholder'));
      if (v && v !== el.getAttribute('data-i18n-placeholder')) el.placeholder = v;
    });
    document.querySelectorAll('.lang-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });
    document.documentElement.lang = currentLang;
  }

  function load(lang) {
    return fetch('locales/' + lang + '.json')
      .then(function (r) { return r.json(); })
      .then(function (data) { translations = data; });
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    return load(lang).then(apply);
  }

  document.addEventListener('DOMContentLoaded', function () {
    load(currentLang).then(apply);
  });

  window.i18n = {
    t: get,
    setLang: setLang,
    getLang: function () { return currentLang; }
  };
})();
