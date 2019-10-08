import { LanguageTranslations, CombinedKeysResult, MissingKey } from "./contracts";

export function combineKeys(languages: LanguageTranslations[]): CombinedKeysResult {
    const languagesList = languages.map(x => x.language);
    const result: CombinedKeysResult = {
        translationKeys: [],
        missingTranslationKeys: []
    };
    const languagesByTranslationKey: { [translationKey: string]: string[] | undefined } = {};

    for (const { language, translationKeys } of languages) {
        for (const translationKey of translationKeys) {
            if (languagesByTranslationKey[translationKey] == null) {
                languagesByTranslationKey[translationKey] = [];
                result.translationKeys.push(translationKey);
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            languagesByTranslationKey[translationKey]!.push(language);
        }
    }

    result.missingTranslationKeys = Object.keys(languagesByTranslationKey)
        .map(translationKey => {
            const resolvedLanguages = languagesByTranslationKey[translationKey];
            if (resolvedLanguages == null) {
                return undefined;
            }

            if (resolvedLanguages.length === languages.length) {
                return undefined;
            }

            const languagesMissingKey = languagesList.filter(language => resolvedLanguages.indexOf(language) === -1);
            const missingKeys = languagesMissingKey.map<MissingKey>(language => ({ language: language, translationKey: translationKey }));

            return missingKeys;
        })
        .filter((x): x is MissingKey[] => x != null)
        .reduce((prevValue, value) => prevValue.concat(value), []);

    return result;
}
