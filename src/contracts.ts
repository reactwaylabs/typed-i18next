export interface LanguageTranslations {
    language: string;
    translationKeys: string[];
}

export interface CombinedKeysResult {
    translationKeys: string[];
    missingTranslationKeys: MissingKey[];
}

export interface MissingKey {
    language: string;
    translationKey: string;
}
