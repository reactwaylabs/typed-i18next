import { generateTypesFile } from "@src/generator";
import { MissingTranslationsError } from "@src/errors";

test("{{caseName}}", async done => {
    const projectDirectory = "{{projectDirectory}}";

    try {
        const result = await generateTypesFile({ inputLocation: projectDirectory, noEmitHeader: true, allowMissingTranslations: false });
        done.fail("No missing translations were found.");
        expect(result).toMatchSnapshot();
    } catch (error) {
        expect(error).toBeInstanceOf(MissingTranslationsError);
        expect(error.missingTranslationKeys).toEqual([
            { language: "lt", translationKey: "tops.tank-top" },
            { language: "en", translationKey: "smth.authentication.login" },
            { language: "en", translationKey: "smth.authentication.register" }
        ]);
        done();
    }
});
