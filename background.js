"use strict";

console.log("Service worker started.");

const getRussianLetters = () => {
  const russianLetters = ["ё", "Ë"];
  for (
    let russianLowercaseCharCode = "а".charCodeAt(0);
    russianLowercaseCharCode <= "я".charCodeAt(0);
    russianLowercaseCharCode++
  ) {
    russianLetters.push(String.fromCharCode(russianLowercaseCharCode));
  }
  for (
    let russianCapitalCharCode = "А".charCodeAt(0);
    russianCapitalCharCode <= "Я".charCodeAt(0);
    russianCapitalCharCode++
  ) {
    russianLetters.push(String.fromCharCode(russianCapitalCharCode));
  }
  return russianLetters;
};

const SEARCH_ENGINE_LANGUAGE_REDIRECT_API =
  "https://serverless-search-engine-language-redirect.vercel.app/api";

chrome.runtime.onInstalled.addListener(() => {
  const russianLetters = getRussianLetters();
  const russianLettersEncoded = russianLetters.map((russianLetter) =>
    encodeURIComponent(russianLetter)
  );

  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1],
    addRules: [
      {
        id: 1,
        priority: 1,
        condition: {
          regexFilter: `^.*(${russianLettersEncoded.join("|")}).*`,
          requestDomains: ["www.google.com", "www.google.ru"],
          resourceTypes: ["main_frame"],
        },
        action: {
          type: "redirect",
          redirect: {
            regexSubstitution: `${SEARCH_ENGINE_LANGUAGE_REDIRECT_API}?url=\\0`,
          },
        },
      },
    ],
  });
  console.log("Added dynamic declarative net request rules");
});
