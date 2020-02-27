import fs from "fs-extra";

import { resolveLanguagesKeys } from "./resolve-languages-keys";
import { combineKeys } from "./combine-keys";
import { generateTypes } from "./generate-types";
import { Log } from "./cli/logging";
import { MissingTranslationsError } from "./errors";

export interface GenerateTypesFileOptions {
    inputLocation: string;
    noEmitHeader?: boolean;
    allowMissingTranslations?: boolean;
}

export async function generateTypesFile({
    inputLocation,
    noEmitHeader = false,
    allowMissingTranslations = true
}: GenerateTypesFileOptions): Promise<string> {
    const languages = await resolveLanguagesKeys(inputLocation);
    Log.info(`Resolved ${languages.length} languages.`);
    Log.debug(`Languages: ${JSON.stringify(languages.map(x => x.language))}.`);
    const combinedKeys = combineKeys(languages);

    if (!allowMissingTranslations && combinedKeys.missingTranslationKeys.length > 0) {
        for (const missingKey of combinedKeys.missingTranslationKeys) {
            Log.error(`Missing translation "${missingKey.translationKey}" key in "${missingKey.language}".`);
        }
        throw new MissingTranslationsError(combinedKeys.missingTranslationKeys);
    } else {
        for (const missingKey of combinedKeys.missingTranslationKeys) {
            Log.warn(`Missing translation "${missingKey.translationKey}" key in "${missingKey.language}".`);
        }
    }

    let header: string;
    if (noEmitHeader) {
        header = "";
    } else {
        header = `/* eslint-disable */\n// DO NOT EDIT! This file is generated with "typed-18next" tool.\n\n`;
    }

    const typesFile = generateTypes(combinedKeys.translationKeys);
    return header + typesFile;
}

export interface CheckGeneratedFilesOptions {
    inputLocation: string;
    outputLocation: string;
    noEmitHeader?: boolean;
    allowMissingTranslations?: boolean;
}

export async function checkGeneratedFiles({ inputLocation, outputLocation, noEmitHeader, allowMissingTranslations }: CheckGeneratedFilesOptions): Promise<boolean> {
    const generatedFile = await generateTypesFile({ inputLocation: inputLocation, noEmitHeader: noEmitHeader, allowMissingTranslations });
    const outputFile = await fs.readFile(outputLocation, "utf8");

    return generatedFile === outputFile;
}
