const i18next = require("i18next");
const backend = require("i18next-fs-backend");
const middlewareI18Next = require("i18next-http-middleware");
function initLocal() {
  i18next
    .use(backend)
    .use(middlewareI18Next.LanguageDetector)
    .init({
      fallbackLng: "en",
      backend: {
        loadPath: "./locales/{{lng}}/translation.json",
      },
    });
}

function isLocalized(t, message) {
  if (t(message)) {
    return t(message);
  } else {
    return message;
  }
}

module.exports = { initLocal, isLocalized };
