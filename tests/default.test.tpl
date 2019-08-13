import { generateTypesFile } from "@src/generator";

test("{{caseName}}", async done => {
    const projectDirectory = "{{projectDirectory}}";

    try {
        const result = await generateTypesFile({inputLocation: projectDirectory, noEmitHeader: true});
        expect(result).toMatchSnapshot();
        done();
    } catch (error) {
        done.fail(error);
    }
});
