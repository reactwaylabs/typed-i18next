#!/usr/bin/env node

import commander from "commander";
import fs from "fs-extra";
import path from "upath";

import { resolveArguments } from "./arguments";
import { generateTypesFile, checkGeneratedFiles } from "../generator";
import { Log } from "./logging";
import { LogLevel } from "./constants";
import { LogLevelDesc } from "loglevel";

const PACKAGE_JSON_PATH = path.resolve(__dirname, "../../package.json");

async function main(argv: string[]): Promise<void> {
    const packageJson: { version: string } = await fs.readJson(PACKAGE_JSON_PATH);
    const cliOptions = resolveArguments(commander.version(packageJson.version, "-v, --version"), argv);

    Log.setLevel(cliOptions.logLevel != null ? (cliOptions.logLevel as LogLevelDesc) : (LogLevel.Info as LogLevelDesc));

    if (cliOptions.input == null || cliOptions.outputFile == null) {
        Log.error("input and output must be defined.");
        process.exit(1);
        return;
    }

    if (cliOptions.check) {
        if (await checkGeneratedFiles({ inputLocation: cliOptions.input, outputLocation: cliOptions.outputFile, allowMissingTranslations: false })) {
            Log.info("Check was successful.");
        } else {
            Log.error("Generated types are not up-to-date.");
            process.exit(1);
            return;
        }
    } else {
        try {
            const typesFile = await generateTypesFile({ inputLocation: cliOptions.input });

            Log.debug(`Output file location: ${cliOptions.outputFile}`);
            await fs.writeFile(cliOptions.outputFile, typesFile);
        } catch (error) {
            Log.error(error);
            process.exit(1);
            return;
        }

        Log.info("Successfully generated types.");
    }
}

main(process.argv);
