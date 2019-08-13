import commander from "commander";

import { resolvePath, resolveBoolean, resolveLogLevelKey } from "./helpers";

export interface Arguments {
    input?: string;
    override?: string;
    outputFile?: string;
    logLevel?: string;
    check?: boolean;
}

export function resolveArguments(cmd: commander.Command, argv: string[]): Arguments {
    const { input, outputFile, override, check, logLevel } = cmd
        .option("-i, --input <path>", "location where translations are located", resolvePath)
        // .option("--override <path>", "location where translations are located", resolvePath)
        .option("-o, --outputFile <file-path>", "location where to generate definitions file.", resolvePath)
        .option("--check [boolean]", "check if generated file up to date (useful for CI)", resolveBoolean)
        .option("--logLevel <level>", "console log level", resolveLogLevelKey)
        .parse(argv) as Arguments;

    return {
        input,
        outputFile,
        override,
        check,
        logLevel
    };
}
