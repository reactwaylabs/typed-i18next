import { LanguageTranslations, CombineKeysResult, MissingKey } from "./contracts";

export function combineKeys(languages: LanguageTranslations[]): CombineKeysResult {
    const languagesList = languages.map(x => x.language);
    const result: CombineKeysResult = {
        translationKeys: [],
        missingTranslationKeys: []
    };
    const check: { [key: string]: string[] | undefined } = {};

    for (const { language, translationKeys } of languages) {
        for (const key of translationKeys) {
            if (check[key] == null) {
                check[key] = [];
                result.translationKeys.push(key);
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            check[key]!.push(language);
        }
    }

    result.missingTranslationKeys = Object.keys(check)
        .map(translationKey => {
            const resolvedLanguages = check[translationKey];
            if (resolvedLanguages == null) {
                return undefined;
            }

            if (resolvedLanguages.length === languages.length) {
                return undefined;
            }

            return languagesList
                .filter(language => resolvedLanguages.indexOf(language) === -1)
                .map<MissingKey>(language => ({ language: language, translationKey: translationKey }));
        })
        .filter((x): x is MissingKey[] => x != null)
        .reduce((prevValue, value) => prevValue.concat(value), []);

    return result;
}
