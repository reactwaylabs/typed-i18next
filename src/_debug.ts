import path from "path";
// import { resolveLanguagesKeys } from "./resolve-languages-keys";
import { generateTypesFile } from "./generator";

async function main(): Promise<void> {
    // await resolveLanguagesKeys(path.resolve(__dirname, "../tests/cases/nested"));
    // await resolveLanguagesKeys(path.resolve(__dirname, "../tests/cases/simple"));
    await generateTypesFile({ inputLocation: path.resolve(__dirname, "../tests/cases/simple") });
}

main();
