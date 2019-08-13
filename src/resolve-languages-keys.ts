import fs from "fs-extra";
import path from "upath";

import { getListFilesRecursively, getListOfDirectories } from "./helpers";
import { LanguageTranslations } from "./contracts";
import { KEY_SEPARATOR } from "./constants";

type Dict = { [key: string]: string | Dict };

export function resolveTranslationKeys(obj: Dict): string[] {
    let result: string[] = [];

    for (const objKey of Object.keys(obj)) {
        const value = obj[objKey];

        if (typeof value === "object") {
            result = result.concat(resolveTranslationKeys(value).map(namespacesWithKey => `${objKey}${KEY_SEPARATOR}${namespacesWithKey}`));
        } else if (typeof value === "string") {
            result.push(objKey);
        }
    }

    return result;
}

export async function resolveFileKeys(rootDir: string, location: string): Promise<string[]> {
    const data = await fs.readJson(path.join(rootDir, location));
    const folderNamespacesList = path
        .dirname(location)
        .split(path.sep)
        .filter(x => x !== ".");
    const fileName = path.basename(location, path.extname(location));

    const resolvedDataKeys = resolveTranslationKeys(data);
    const folderNamespace = folderNamespacesList.length > 0 ? `${folderNamespacesList.join(KEY_SEPARATOR)}${KEY_SEPARATOR}` : "";
    const result: string[] = resolvedDataKeys.map(namespacesWithKey => `${folderNamespace}${fileName}${KEY_SEPARATOR}${namespacesWithKey}`);

    return result;
}

export async function resolveLanguageTranslations(langName: string, location: string): Promise<LanguageTranslations> {
    const fileList = (await getListFilesRecursively(location)).map(x => path.relative(location, x));
    const keys = (await Promise.all(fileList.map(x => resolveFileKeys(location, x))))
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
