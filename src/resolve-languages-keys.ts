import fs from "fs-extra";
import path from "upath";

import { getListFilesRecursively, getListOfDirectories } from "./helpers";
import { LanguageTranslations } from "./contracts";
import { KEY_SEPARATOR, NAMESPACE_SEPARATOR } from "./constants";

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

export async function resolveLanguageTranslations(langName: string, location: string): Promise<LanguageTranslations> {
    const fileList = (await getListFilesRecursively(location)).map(x => path.relative(location, x));

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
