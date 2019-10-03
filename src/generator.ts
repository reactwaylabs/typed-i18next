import fs from "fs-extra";

import { resolveLanguagesKeys } from "./resolve-languages-keys";
import { combineKeys } from "./combine-keys";
import { generateTypes } from "./generate-types";
import { Log } from "./cli/logging";
import { MissingKey } from "./contracts";

export interface GenerateTypesFileOptions {
    inputLocation: string;
    noEmitHeader?: boolean;
}

export interface GenerateTypesFileResult {
    fileContent: string;
    missingTranslationKeys: MissingKey[];
}

export async function generateTypesFile({
    inputLocation,
    noEmitHeader = false
}: GenerateTypesFileOptions): Promise<GenerateTypesFileResult> {
    const languages = await resolveLanguagesKeys(inputLocation);
    Log.info(`Resolved ${languages.length} languages.`);
    Log.debug(`Languages: ${JSON.stringify(languages.map(x => x.language))}.`);
    const combinedKeys = combineKeys(languages);

    for (const missingKey of combinedKeys.missingTranslationKeys) {
        Log.warn(`Missing translation "${missingKey.translationKey}" key in "${missingKey.language}".`);
    }

    let header: string;
    if (noEmitHeader) {
        header = "";
    } else {
        header = `// DO NOT EDIT! This file is generated with "typed-18next" tool.\n\n`;
    }

    const typesFile = generateTypes(combinedKeys.translationKeys);

    return {
        fileContent: header + typesFile,
        missingTranslationKeys: combinedKeys.missingTranslationKeys
    };
}

export interface CheckGeneratedFilesOptions {
    inputLocation: string;
    outputLocation: string;
    noEmitHeader?: boolean;
}

export async function checkGeneratedFiles({ inputLocation, outputLocation, noEmitHeader }: CheckGeneratedFilesOptions): Promise<boolean> {
    const generatedFile = await generateTypesFile({ inputLocation: inputLocation, noEmitHeader: noEmitHeader });
    const outputFile = await fs.readFile(outputLocation, "utf8");

    return generatedFile.fileContent === outputFile && generatedFile.missingTranslationKeys.length === 0;
}
