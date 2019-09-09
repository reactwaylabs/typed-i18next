import { MissingKey } from "./contracts";

export class MissingTranslationsError extends Error {
    constructor(public readonly missingTranslationKeys: MissingKey[]) {
        super("Not all translations are present. Check log for missing translation keys.");

        this.missingTranslationKeys = missingTranslationKeys;
    }
}
