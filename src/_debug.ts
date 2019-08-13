import path from "path";
import { generateTypesFile } from "./generator";

async function main(): Promise<void> {
    await generateTypesFile({ inputLocation: path.resolve(__dirname, "../tests/cases/nested") });
}

main();
