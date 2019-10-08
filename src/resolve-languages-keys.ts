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

export async function resolveLanguageTranslations(langName: string, location: string): Promise<LanguageTranslations> {
    const fileList = (await getListFilesRecursively(location)).map(x => path.toUnix(path.relative(location, x)));

    const keys = (await Promise.all(
        fileList.map<Promise<string[]>>(async fileName => {
            const namespaceName = path.removeExt(fileName, path.extname(fileName));
            const fileContent = await fs.readJson(path.join(location, fileName));
            const namespaceKeys = resolveTranslationKeys(fileContent);

            return namespaceKeys.map(x => `${namespaceName}${NAMESPACE_SEPARATOR}${x}`);
        })
    ))
        .reduce((prev, curr) => prev.concat(curr), [])
        .filter(x => x.length !== 0);

    return {
        language: langName,
        translationKeys: keys
    };
}

export async function resolveLanguagesKeys(inputPath: string): Promise<LanguageTranslations[]> {
    const list = await getListOfDirectories(inputPath);
    const languages = await Promise.all(list.map(x => resolveLanguageTranslations(x, path.resolve(inputPath, x))));

    return languages;
}
