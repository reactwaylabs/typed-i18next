import { MissingKey } from "./contracts";

export class MissingTranslationsError extends Error {
    constructor(keys: MissingKey[]) {
        super(`Not all translations are present.\n${JSON.stringify(keys)}`);

        this._missingTranslationKeys = keys;
    }

    private _missingTranslationKeys: MissingKey[] = [];

    public get missingTranslationKeys(): MissingKey[] {
        return this._missingTranslationKeys;
    }
}
