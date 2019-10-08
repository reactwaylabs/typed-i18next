import fs from "fs-extra";
import path from "upath";

import { getListFilesRecursively, getListOfDirectories } from "./helpers";
import { LanguageTranslations } from "./contracts";
import { KEY_SEPARATOR, NAMESPACE_SEPARATOR } from "./constants";

type NestedDictionary = { [key: string]: string | NestedDictionary };

export function resolveTranslationKeys(translationsObject: NestedDictionary): string[] {
    let result: string[] = [];

    for (const currentKey of Object.keys(translationsObject)) {
        const currentTranslation = translationsObject[currentKey];

        // If there is an inner object
        if (typeof currentTranslation === "object") {
            // Resolve its keys
            const scope = currentKey;
            const scopeKeys = resolveTranslationKeys(currentTranslation);

            // And build the key
            const scopedKeys = scopeKeys.map(innerKey => `${scope}${KEY_SEPARATOR}${innerKey}`);

            result = result.concat(scopedKeys);
        } else if (typeof currentTranslation === "string") {
            // Just push the the string value.
            result.push(currentKey);
        }
    }

    return result;
}

export async function resolveLanguageTranslations(language: string, location: string): Promise<LanguageTranslations> {
    // Gather all translation files.
    const translationsFilesAbsolute = await getListFilesRecursively(location);

    // Convert paths from absolute to relative (Unix style).
    const translationsFiles = translationsFilesAbsolute.map(x => path.toUnix(path.relative(location, x)));

    // Gather promises for translation keys.
    const translationKeysPromises = translationsFiles.map(fileName => extractTranslationsFromFile(fileName, location));
    const translationKeys = await Promise.all(translationKeysPromises);

    // Flatten and filter out empty arrays.
    const flatNamespacesKeys = translationKeys.reduce((prev, curr) => prev.concat(curr), []).filter(x => x.length !== 0);

    return {
        language: language,
        translationKeys: flatNamespacesKeys
    };
}

export async function extractTranslationsFromFile(fileName: string, location: string): Promise<string[]> {
    // Resolve translations namespace name.
    const namespaceName = path.removeExt(fileName, path.extname(fileName));

    const fileContent = await fs.readJson(path.join(location, fileName));

    const namespaceKeys = resolveTranslationKeys(fileContent);

    return namespaceKeys.map(translationKey => `${namespaceName}${NAMESPACE_SEPARATOR}${translationKey}`);
}

export async function resolveLanguagesKeys(inputPath: string): Promise<LanguageTranslations[]> {
    const list = await getListOfDirectories(inputPath);
    const languages = await Promise.all(list.map(x => resolveLanguageTranslations(x, path.resolve(inputPath, x))));

    return languages;
}
