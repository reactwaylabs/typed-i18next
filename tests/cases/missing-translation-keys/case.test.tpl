import { generateTypesFile } from "@src/generator";
import { MissingTranslationsError } from "@src/errors";

test("{{caseName}}", async done => {
    const projectDirectory = "{{projectDirectory}}";

    try {
        await generateTypesFile({ inputLocation: projectDirectory, noEmitHeader: true, allowMissingTranslations: false });
        done.fail("No missing translations were found.");
    } catch (error) {
        expect(error).toBeInstanceOf(MissingTranslationsError);
        expect(error.missingTranslationKeys).toMatchSnapshot();
        done();
    }
});
