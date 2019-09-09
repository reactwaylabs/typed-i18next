import { generateTypesFile } from "@src/generator";

test("{{caseName}}", async done => {
    const projectDirectory = "{{projectDirectory}}";

    try {
        const result = await generateTypesFile({inputLocation: projectDirectory, noEmitHeader: true});
        done.fail("No missing translations were found.");
        expect(result).toMatchSnapshot();
    } catch (error) {
        expect(error).toEqual({
            en: [
                "smth.authentication.login",
                "smth.authentication.register"
            ],
            lt: [
                "tops.tank-top"
            ]
        }); // TODO: Check for missing translations
        done();
    }
});
